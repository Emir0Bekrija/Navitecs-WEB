"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import type { TooltipContentProps } from "recharts";
import {
  Briefcase,
  FileText,
  MessageSquare,
  FolderKanban,
  ArrowRight,
  Users,
  Building2,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────────

type LabelPoint = { label: string; count: number };
type DayPoint = { day: string; count: number };

type Totals = {
  totalJobs: number;
  activeJobs: number;
  totalProjects: number;
  totalApplicants: number;
  totalCompanyContacts: number;
};

type ChartStats = {
  totals: { applications: number; contacts: number };
  applicationsByDay: DayPoint[];
  contactsByDay: DayPoint[];
  applicationsByRole: LabelPoint[];
  contactsByProjectType: LabelPoint[];
  projectViews: LabelPoint[];
  pageViewsByPath: LabelPoint[];
};

// ── Date range presets ─────────────────────────────────────────────────────────

type Preset = "2m" | "3m" | "6m" | "12m" | "thisYear" | "lastYear" | "custom";

function getPresetDates(preset: Preset): { from: string; to: string } {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

  if (preset === "2m") {
    const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    return { from: fmt(from), to: fmt(now) };
  }
  if (preset === "3m") {
    const from = new Date(now);
    from.setMonth(from.getMonth() - 3);
    return { from: fmt(from), to: fmt(now) };
  }
  if (preset === "6m") {
    const from = new Date(now);
    from.setMonth(from.getMonth() - 6);
    return { from: fmt(from), to: fmt(now) };
  }
  if (preset === "thisYear") {
    return { from: `${now.getFullYear()}-01-01`, to: fmt(now) };
  }
  if (preset === "lastYear") {
    const y = now.getFullYear() - 1;
    return { from: `${y}-01-01`, to: `${y}-12-31` };
  }
  if (preset === "12m") {
    const from = new Date(now);
    from.setFullYear(from.getFullYear() - 1);
    return { from: fmt(from), to: fmt(now) };
  }
  return { from: "", to: "" };
}

// ── Merge daily data into a single series ─────────────────────────────────────

function mergeDaily(apps: DayPoint[], contacts: DayPoint[]) {
  const days = new Set([
    ...apps.map((d) => d.day),
    ...contacts.map((d) => d.day),
  ]);
  const appMap = new Map(apps.map((d) => [d.day, d.count]));
  const contactMap = new Map(contacts.map((d) => [d.day, d.count]));
  return Array.from(days)
    .sort()
    .map((day) => {
      const [y, mo, dd] = day.split("-");
      const label = new Date(Number(y), Number(mo) - 1, Number(dd))
        .toLocaleString("en-GB", { day: "numeric", month: "short" });
      return {
        day,
        label,
        Applications: appMap.get(day) ?? 0,
        Contacts: contactMap.get(day) ?? 0,
      };
    });
}

// ── Custom tooltip ────────────────────────────────────────────────────────────

function ChartTooltip({ active, payload, label }: TooltipContentProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl space-y-1">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} className="font-semibold" style={{ color: entry.color as string }}>
          {entry.name}: {entry.value as number}
        </p>
      ))}
    </div>
  );
}

// ── Horizontal bar breakdown ──────────────────────────────────────────────────

function Breakdown({
  data,
  color,
  emptyText,
  formatLabel,
}: {
  data: LabelPoint[];
  color: string;
  emptyText: string;
  formatLabel?: (label: string) => string;
}) {
  if (!data.length)
    return <p className="text-gray-500 text-sm">{emptyText}</p>;
  const max = Math.max(...data.map((d) => d.count));
  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.label}>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-300 truncate max-w-[75%]">
              {formatLabel ? formatLabel(d.label) : d.label}
            </span>
            <span className="text-gray-500 shrink-0">{d.count}</span>
          </div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${(d.count / max) * 100}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Skeleton ──────────────────────────────────────────────────────────────────

function Skeleton({ className }: { className?: string }) {
  return (
    <div className={`bg-[#0a0a0a] border border-white/10 rounded-2xl animate-pulse ${className}`} />
  );
}

// ── Main component ─────────────────────────────────────────────────────────────

export default function DashboardClient() {
  const [totals, setTotals] = useState<Totals | null>(null);
  const [chartStats, setChartStats] = useState<ChartStats | null>(null);
  const [chartLoading, setChartLoading] = useState(true);
  const [preset, setPreset] = useState<Preset>("2m");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [hiddenLines, setHiddenLines] = useState<Set<string>>(new Set());
  const totalsLoaded = useRef(false);

  function toggleLine(name: string) {
    setHiddenLines((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  // Load static totals once
  useEffect(() => {
    if (totalsLoaded.current) return;
    totalsLoaded.current = true;
    fetch("/api/admin/dashboard/totals")
      .then((r) => r.json())
      .then(setTotals)
      .catch(() => {});
  }, []);

  const { from, to } =
    preset === "custom"
      ? { from: customFrom, to: customTo }
      : getPresetDates(preset);

  const loadChartStats = useCallback(async () => {
    if (preset === "custom" && (!customFrom || !customTo)) return;
    setChartLoading(true);
    const params = new URLSearchParams({ from, to });
    const res = await fetch(`/api/admin/dashboard/stats?${params}`);
    if (res.ok) setChartStats(await res.json());
    setChartLoading(false);
  }, [from, to, preset, customFrom, customTo]);

  useEffect(() => { loadChartStats(); }, [loadChartStats]);

  const mergedDaily =
    chartStats ? mergeDaily(chartStats.applicationsByDay, chartStats.contactsByDay) : [];

  const PRESETS: { key: Preset; label: string }[] = [
    { key: "2m", label: "This & last month" },
    { key: "3m", label: "Last 3 months" },
    { key: "6m", label: "Last 6 months" },
    { key: "12m", label: "Last 12 months" },
    { key: "thisYear", label: "This year" },
    { key: "lastYear", label: "Last year" },
    { key: "custom", label: "Custom" },
  ];

  // Show roughly 15 tick labels regardless of data density
  const xAxisInterval = Math.max(0, Math.ceil(mergedDaily.length / 15) - 1);

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h2 className="text-2xl font-bold mb-1">Dashboard</h2>
        <p className="text-gray-400 text-sm">Overview of your site activity</p>
      </div>

      {/* Stat cards — skeleton only on first load, then always visible */}
      {!totals || !chartStats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Applications", value: chartStats.totals.applications, sub: "in period", icon: FileText, href: "/navitecs-control-admin/applications", color: "#00AEEF" },
            { label: "Contact Submissions", value: chartStats.totals.contacts, sub: "in period", icon: MessageSquare, href: "/navitecs-control-admin/contacts", color: "#00FF9C" },
            { label: "Active Jobs", value: totals.activeJobs, sub: `${totals.totalJobs} total`, icon: Briefcase, href: "/navitecs-control-admin/jobs", color: "#00AEEF" },
            { label: "Projects", value: totals.totalProjects, sub: "in portfolio", icon: FolderKanban, href: "/navitecs-control-admin/projects", color: "#00FF9C" },
            { label: "Total Applicants", value: totals.totalApplicants, sub: "unique people", icon: Users, href: "/navitecs-control-admin/applicants", color: "#00AEEF" },
            { label: "Company Contacts", value: totals.totalCompanyContacts, sub: "unique companies", icon: Building2, href: "/navitecs-control-admin/company-contacts", color: "#00FF9C" },
          ].map(({ label, value, sub, icon: Icon, href, color }) => (
            <Link
              key={label}
              href={href}
              className="group bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${color}18` }}>
                  <Icon size={18} style={{ color }} />
                </div>
                <ArrowRight size={14} className="text-gray-600 group-hover:text-gray-400 transition-colors" />
              </div>
              <div className="text-2xl font-bold mb-0.5" style={{ color }}>{value}</div>
              <div className="text-xs font-medium text-white">{label}</div>
              <div className="text-xs text-gray-600 mt-0.5">{sub}</div>
            </Link>
          ))}
        </div>
      )}

      {/* Date range controls + line chart */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-5">
        {/* Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPreset(p.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                preset === p.key
                  ? "bg-[#00AEEF]/20 border border-[#00AEEF]/40 text-[#00AEEF]"
                  : "bg-white/5 border border-white/10 text-gray-400 hover:text-white"
              }`}
            >
              {p.label}
            </button>
          ))}
          {preset === "custom" && (
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00AEEF]/50 [color-scheme:dark]"
              />
              <span className="text-gray-600 text-xs">→</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="bg-[#111] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00AEEF]/50 [color-scheme:dark]"
              />
            </div>
          )}
        </div>

        <div className="border-t border-white/5" />

        <div>
          <div className="flex items-center justify-between mb-0.5">
            <h3 className="font-semibold">Applications & Contact Submissions</h3>
            {chartLoading && (
              <span className="text-xs text-gray-600 animate-pulse">Loading…</span>
            )}
          </div>
          <p className="text-xs text-gray-500 mb-5">Daily totals — click legend to toggle</p>
          {chartLoading && !chartStats ? (
            <div className="h-56 animate-pulse bg-white/3 rounded-xl" />
          ) : mergedDaily.length === 0 ? (
            <p className="text-gray-500 text-sm">No data in this period</p>
          ) : (
            <div className={chartLoading ? "opacity-50 pointer-events-none transition-opacity" : "transition-opacity"}>
              <ResponsiveContainer width="100%" height={240}>
                <LineChart data={mergedDaily} margin={{ top: 8, right: 32, left: -20, bottom: 4 }}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.2)"
                    vertical={true}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "#6b7280", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    interval={xAxisInterval}
                    padding={{ left: 8, right: 8 }}
                  />
                  <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={(props) => <ChartTooltip {...props} />} />
                  <Legend
                    wrapperStyle={{ fontSize: "12px", paddingTop: "16px", cursor: "pointer" }}
                    onClick={(e) => toggleLine(e.dataKey as string)}
                    formatter={(value) => (
                      <span style={{
                        color: hiddenLines.has(value) ? "#4b5563" : "#9ca3af",
                        textDecoration: hiddenLines.has(value) ? "line-through" : "none",
                      }}>
                        {value}
                      </span>
                    )}
                  />
                  <Line type="monotone" dataKey="Applications" stroke="#00AEEF" strokeWidth={2} dot={{ r: 2, fill: "#00AEEF" }} activeDot={{ r: 5 }} hide={hiddenLines.has("Applications")} />
                  <Line type="monotone" dataKey="Contacts" stroke="#00FF9C" strokeWidth={2} dot={{ r: 2, fill: "#00FF9C" }} activeDot={{ r: 5 }} hide={hiddenLines.has("Contacts")} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* Breakdowns */}
      {chartLoading && !chartStats ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
        </div>
      ) : chartStats ? (
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${chartLoading ? "opacity-50 transition-opacity" : "transition-opacity"}`}>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold mb-1">Applications by Role</h3>
            <p className="text-xs text-gray-500 mb-5">Top roles in selected period</p>
            <Breakdown
              data={chartStats.applicationsByRole}
              color="#00AEEF"
              emptyText="No applications in this period"
            />
          </div>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold mb-1">Contacts by Project Type</h3>
            <p className="text-xs text-gray-500 mb-5">Breakdown of inquiry types</p>
            <Breakdown
              data={chartStats.contactsByProjectType}
              color="#00FF9C"
              emptyText="No contacts in this period"
            />
          </div>
        </div>
      ) : null}

      {/* Project views + Page views */}
      {chartLoading && !chartStats ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-56" />
          <Skeleton className="h-56" />
        </div>
      ) : chartStats ? (
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${chartLoading ? "opacity-50 transition-opacity" : "transition-opacity"}`}>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold mb-1">Project Views</h3>
            <p className="text-xs text-gray-500 mb-5">Per project in selected period</p>
            <Breakdown
              data={chartStats.projectViews}
              color="#a78bfa"
              emptyText="No project page views recorded yet"
              formatLabel={(slug) =>
                slug.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")
              }
            />
          </div>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
            <h3 className="font-semibold mb-1">Page Views</h3>
            <p className="text-xs text-gray-500 mb-5">All pages in selected period</p>
            <Breakdown
              data={chartStats.pageViewsByPath}
              color="#f59e0b"
              emptyText="No page views recorded yet"
              formatLabel={(path) => {
                const map: Record<string, string> = {
                  "/home": "Home",
                  "/about": "About",
                  "/services": "Services",
                  "/projects": "Projects",
                  "/careers": "Careers",
                  "/contact": "Contact",
                };
                const fallback = path.replace(/^\//, "").replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Home";
                return map[path] ?? fallback;
              }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
