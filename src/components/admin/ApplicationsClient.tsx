"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  FileText,
  Mail,
  Phone,
  Linkedin,
  Globe,
  FileDown,
  Reply,
  Star,
  X,
  Save,
  Users,
  Bell,
} from "lucide-react";
import type { Application, ApplicantRanking, Job } from "@/types/index";
import ReplyModal from "./ReplyModal";
import { useAdminStream } from "@/hooks/useAdminStream";

type PagedResponse = {
  data: Application[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

// ── Score picker: 1–10 buttons ────────────────────────────────────────────────
function ScorePicker({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: number | null) => void;
}) {
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(value === n ? null : n)}
          className={`w-7 h-7 rounded-md text-xs font-semibold transition-all ${
            value === n
              ? "bg-[#00AEEF] text-black"
              : "bg-white/5 text-gray-400 hover:bg-white/10"
          }`}
        >
          {n}
        </button>
      ))}
      {value !== null && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-gray-600 hover:text-gray-400 ml-1"
          title="Clear score"
        >
          <X size={12} />
        </button>
      )}
    </div>
  );
}

// ── Applicant ranking panel ───────────────────────────────────────────────────
function ApplicantPanel({
  applicant,
  onSaved,
}: {
  applicant: ApplicantRanking;
  onSaved: (updated: ApplicantRanking) => void;
}) {
  const [score, setScore] = useState<number | null>(applicant.score);
  const [comments, setComments] = useState(applicant.comments ?? "");
  const [fitsRoles, setFitsRoles] = useState(applicant.fitsRoles ?? "");
  const [doesNotFit, setDoesNotFit] = useState(applicant.doesNotFit ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const prevId = useRef(applicant.id);
  useEffect(() => {
    if (prevId.current !== applicant.id) {
      setScore(applicant.score);
      setComments(applicant.comments ?? "");
      setFitsRoles(applicant.fitsRoles ?? "");
      setDoesNotFit(applicant.doesNotFit ?? "");
      prevId.current = applicant.id;
    }
  }, [applicant]);

  async function handleSave() {
    setSaving(true);
    const res = await fetch(`/api/admin/applicants/${applicant.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score,
        comments: comments || null,
        fitsRoles: fitsRoles || null,
        doesNotFit: doesNotFit || null,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onSaved({
        ...applicant,
        score,
        comments: comments || null,
        fitsRoles: fitsRoles || null,
        doesNotFit: doesNotFit || null,
      });
    }
  }

  return (
    <div className="border border-[#00AEEF]/20 rounded-xl p-4 space-y-3 bg-[#00AEEF]/3">
      <div className="flex items-center gap-2">
        <Star size={14} className="text-[#00AEEF]" />
        <span className="text-xs font-semibold text-[#00AEEF] uppercase tracking-wider">
          Applicant Ranking
        </span>
        {applicant._count.applications > 1 && (
          <span className="ml-auto flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-full">
            <Users size={11} />
            {applicant._count.applications} applications
          </span>
        )}
      </div>

      <div>
        <p className="text-xs text-gray-500 mb-1.5">Score (1–10)</p>
        <ScorePicker value={score} onChange={setScore} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Fits roles / skills</label>
          <textarea
            value={fitsRoles}
            onChange={(e) => setFitsRoles(e.target.value)}
            rows={2}
            placeholder="e.g. BIM Coordination, Revit"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-[#00AEEF]/50"
          />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Doesn&apos;t fit</label>
          <textarea
            value={doesNotFit}
            onChange={(e) => setDoesNotFit(e.target.value)}
            rows={2}
            placeholder="e.g. Senior management"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-white/20"
          />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 block mb-1">Internal notes</label>
        <textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={2}
          placeholder="Private comments visible only to admins"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 resize-none focus:outline-none focus:border-white/20"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 px-4 py-2 bg-[#00AEEF]/15 border border-[#00AEEF]/30 text-[#00AEEF] rounded-lg text-sm hover:bg-[#00AEEF]/25 transition-all disabled:opacity-50"
      >
        <Save size={13} />
        {saving ? "Saving…" : saved ? "Saved!" : "Save ranking"}
      </button>
    </div>
  );
}

// ── Pagination bar ────────────────────────────────────────────────────────────
function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  // Build page number range: always show first, last, current ±1
  const pages: (number | "…")[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "…") {
      pages.push("…");
    }
  }

  return (
    <div className="flex items-center justify-between pt-2">
      <p className="text-xs text-gray-500">
        {from}–{to} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronLeft size={15} />
        </button>
        {pages.map((p, i) =>
          p === "…" ? (
            <span key={`ellipsis-${i}`} className="px-1 text-gray-600 text-sm">…</span>
          ) : (
            <button
              key={p}
              onClick={() => onChange(p)}
              className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                p === page
                  ? "bg-[#00AEEF] text-black"
                  : "border border-white/10 text-gray-400 hover:text-white hover:border-white/20"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="p-1.5 rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
        >
          <ChevronRight size={15} />
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
export default function ApplicationsClient() {
  const [result, setResult] = useState<PagedResponse | null>(null);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyTarget, setReplyTarget] = useState<{ email: string; name: string; role: string } | null>(null);

  // Filters
  const [jobFilter, setJobFilter] = useState("");
  const [minScore, setMinScore] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [page, setPage] = useState(1);

  // Real-time notifications
  const [newCount, setNewCount] = useState(0);
  const onNewApplication = useCallback(() => setNewCount((n) => n + 1), []);
  useAdminStream("new_application", onNewApplication);

  const fetchApplications = useCallback(async (p = page) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (jobFilter) params.set("jobId", jobFilter);
    if (minScore) params.set("minScore", minScore);
    if (dateFrom) params.set("dateFrom", dateFrom);
    if (dateTo) params.set("dateTo", dateTo);
    params.set("page", String(p));
    const data: PagedResponse = await fetch(`/api/admin/applications?${params.toString()}`).then((r) => r.json());
    setResult(data);
    setLoading(false);
  }, [jobFilter, minScore, dateFrom, dateTo, page]);

  useEffect(() => {
    fetch("/api/admin/jobs")
      .then((r) => (r.ok ? r.json() : []))
      .then((data: unknown) => setJobs(Array.isArray(data) ? data : []));
  }, []);

  // Reset to page 1 when filters change, then fetch
  const filtersRef = useRef({ jobFilter, minScore, dateFrom, dateTo });
  useEffect(() => {
    const prev = filtersRef.current;
    const filtersChanged =
      prev.jobFilter !== jobFilter ||
      prev.minScore !== minScore ||
      prev.dateFrom !== dateFrom ||
      prev.dateTo !== dateTo;

    filtersRef.current = { jobFilter, minScore, dateFrom, dateTo };

    if (filtersChanged) {
      setPage(1);
      fetchApplications(1);
    } else {
      fetchApplications(page);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobFilter, minScore, dateFrom, dateTo, page]);

  function handlePageChange(p: number) {
    setPage(p);
    setExpandedId(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function clearFilters() {
    setJobFilter("");
    setMinScore("");
    setDateFrom("");
    setDateTo("");
  }

  function loadNew() {
    setNewCount(0);
    setPage(1);
    setExpandedId(null);
    fetchApplications(1);
  }

  const hasFilters = jobFilter || minScore || dateFrom || dateTo;
  const applications = result?.data ?? [];

  function handleApplicantSaved(appId: string, updated: ApplicantRanking) {
    setResult((prev) =>
      prev
        ? {
            ...prev,
            data: prev.data.map((a) =>
              a.id === appId ? { ...a, applicant: updated } : a
            ),
          }
        : prev
    );
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold">Applications</h2>
        <p className="text-gray-400 text-sm mt-0.5">
          {result
            ? `${result.total} total · showing ${applications.length}${hasFilters ? " (filtered)" : ""}`
            : "Loading…"}
        </p>
      </div>

      {/* New items banner */}
      {newCount > 0 && (
        <button
          onClick={loadNew}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#00AEEF]/10 border border-[#00AEEF]/30 text-[#00AEEF] rounded-2xl text-sm font-medium hover:bg-[#00AEEF]/20 transition-all animate-pulse"
        >
          <Bell size={15} />
          {newCount} new application{newCount !== 1 ? "s" : ""} received — click to load
        </button>
      )}

      {/* Filter bar */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs text-gray-500 block mb-1">Job posting</label>
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00AEEF]/50 appearance-none"
            >
              <option value="">All jobs</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>{j.title}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs text-gray-500 block mb-1">Min applicant score</label>
            <select
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00AEEF]/50 appearance-none"
            >
              <option value="">Any score</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                <option key={n} value={n}>{n}+ stars</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">From</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00AEEF]/50 [color-scheme:dark]"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-gray-500 block mb-1">To</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00AEEF]/50 [color-scheme:dark]"
              />
            </div>
          </div>
        </div>

        {hasFilters && (
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors"
            >
              <X size={13} />
              Clear filters
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : applications.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-12 text-center">
          <FileText className="mx-auto text-gray-600 mb-4" size={40} />
          <p className="text-gray-400">
            {hasFilters ? "No applications match your filters" : "No applications yet"}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {applications.map((app) => {
              const isExpanded = expandedId === app.id;
              const isRepeat = (app.applicant?._count.applications ?? 0) > 1;
              const score = app.applicant?.score;

              return (
                <div
                  key={app.id}
                  className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden"
                >
                  <button
                    className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/3 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : app.id)}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#00AEEF]/15 flex items-center justify-center text-[#00AEEF] font-bold shrink-0">
                      {app.firstName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-medium text-white">
                          {app.firstName} {app.lastName}
                        </p>
                        {isRepeat && (
                          <span className="flex items-center gap-1 text-xs text-amber-400 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded-full">
                            <Users size={10} />
                            {app.applicant!._count.applications}×
                          </span>
                        )}
                        {score !== null && score !== undefined && (
                          <span className="flex items-center gap-1 text-xs text-[#00AEEF] bg-[#00AEEF]/10 border border-[#00AEEF]/20 px-1.5 py-0.5 rounded-full">
                            <Star size={9} fill="currentColor" />
                            {score}/10
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 truncate">
                        {app.job ? app.job.title : app.role}
                      </p>
                    </div>
                    <div className="text-xs text-gray-500 shrink-0 hidden sm:block text-right">
                      <div>{new Date(app.submittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</div>
                      <div>{new Date(app.submittedAt).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}</div>
                    </div>
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-gray-400 shrink-0" />
                    ) : (
                      <ChevronDown size={16} className="text-gray-400 shrink-0" />
                    )}
                  </button>

                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2 text-gray-300">
                          <Mail size={14} className="text-[#00AEEF] shrink-0" />
                          <a
                            href={`mailto:${app.email}`}
                            className="hover:text-[#00AEEF] transition-colors truncate"
                          >
                            {app.email}
                          </a>
                        </div>
                        {app.phone && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <Phone size={14} className="text-[#00AEEF] shrink-0" />
                            {app.phone}
                          </div>
                        )}
                        {app.linkedin && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <Linkedin size={14} className="text-[#00AEEF] shrink-0" />
                            <a
                              href={app.linkedin}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#00AEEF] transition-colors truncate"
                            >
                              LinkedIn Profile
                            </a>
                          </div>
                        )}
                        {app.portfolio && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <Globe size={14} className="text-[#00AEEF] shrink-0" />
                            <a
                              href={app.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-[#00AEEF] transition-colors truncate"
                            >
                              Portfolio
                            </a>
                          </div>
                        )}
                      </div>

                      {app.cvFileName && (
                        <a
                          href={`/api/admin/cv/${encodeURIComponent(app.cvFileName)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 bg-[#00AEEF]/10 border border-[#00AEEF]/20 text-[#00AEEF] rounded-lg text-sm hover:bg-[#00AEEF]/20 transition-colors"
                        >
                          <FileDown size={14} />
                          View CV — {app.cvFileName.replace(/^\d+-/, "")}
                        </a>
                      )}

                      {app.message && (
                        <div>
                          <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                            Cover Letter
                          </p>
                          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {app.message}
                          </p>
                        </div>
                      )}

                      {app.applicant && (
                        <ApplicantPanel
                          applicant={app.applicant}
                          onSaved={(updated) => handleApplicantSaved(app.id, updated)}
                        />
                      )}

                      <div className="flex items-center gap-3 pt-1">
                        <button
                          onClick={() =>
                            setReplyTarget({
                              email: app.email,
                              name: `${app.firstName} ${app.lastName}`,
                              role: app.job?.title ?? app.role,
                            })
                          }
                          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00AEEF]/15 to-[#00FF9C]/15 border border-[#00AEEF]/30 text-white rounded-lg text-sm hover:from-[#00AEEF]/25 hover:to-[#00FF9C]/25 transition-all"
                        >
                          <Reply size={14} />
                          Reply via Email
                        </button>
                        <p className="text-xs text-gray-600">
                          {new Date(app.submittedAt).toLocaleString("en-GB", {
                            dateStyle: "long",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {result && (
            <Pagination
              page={result.page}
              totalPages={result.totalPages}
              total={result.total}
              pageSize={result.pageSize}
              onChange={handlePageChange}
            />
          )}
        </>
      )}

      {replyTarget && (
        <ReplyModal
          to={replyTarget.email}
          defaultSubject={`Re: Application for ${replyTarget.role}`}
          onClose={() => setReplyTarget(null)}
        />
      )}
    </div>
  );
}
