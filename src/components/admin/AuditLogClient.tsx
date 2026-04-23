"use client";

import { useCallback, useEffect, useState } from "react";
import { ScrollText, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";

type LogEntry = {
  id: number;
  action: string;
  ip: string | null;
  username: string | null;
  userId: number | null;
  metadata: unknown;
  createdAt: string;
};

const ACTION_STYLES: Record<string, string> = {
  login_success: "text-[#00FF9C] bg-[#00FF9C]/10 border-[#00FF9C]/20",
  login_failed: "text-red-400 bg-red-500/10 border-red-500/20",
  logout: "text-gray-400 bg-white/5 border-white/10",
  session_revoked: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  sessions_revoke_all: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  password_changed: "text-[#00AEEF] bg-[#00AEEF]/10 border-[#00AEEF]/20",
  user_created: "text-[#00AEEF] bg-[#00AEEF]/10 border-[#00AEEF]/20",
  user_deleted: "text-red-400 bg-red-500/10 border-red-500/20",
};

const ACTION_LABELS: Record<string, string> = {
  login_success: "Login",
  login_failed: "Failed login",
  logout: "Logout",
  session_revoked: "Session revoked",
  sessions_revoke_all: "All sessions revoked",
  password_changed: "Password changed",
  user_created: "User created",
  user_deleted: "User deleted",
};

const ALL_ACTIONS = Object.keys(ACTION_LABELS);

export default function AuditLogClient() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionFilter, setActionFilter] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page) });
    if (actionFilter) params.set("action", actionFilter);
    const res = await fetch(`/api/admin/audit-log?${params}`);
    if (res.ok) {
      const data = await res.json() as { data: LogEntry[]; total: number; totalPages: number };
      setLogs(data.data);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    }
    setLoading(false);
  }, [page, actionFilter]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [actionFilter]);

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold">Audit Log</h2>
          <p className="text-gray-400 text-sm mt-0.5">{total} event{total !== 1 ? "s" : ""}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-[#0a0a0a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00FF9C]/50 appearance-none"
          >
            <option value="">All events</option>
            {ALL_ACTIONS.map((a) => (
              <option key={a} value={a}>{ACTION_LABELS[a] ?? a}</option>
            ))}
          </select>
          <button
            onClick={load}
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-400 hover:text-white border border-white/10 rounded-lg transition-colors"
          >
            <RefreshCw size={13} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 animate-pulse h-14" />
          ))}
        </div>
      ) : logs.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-12 text-center">
          <ScrollText className="mx-auto text-gray-600 mb-4" size={40} />
          <p className="text-gray-400">No events yet</p>
        </div>
      ) : (
        <>
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs text-gray-500 uppercase tracking-wider">
                  <th className="text-left px-5 py-3">Event</th>
                  <th className="text-left px-5 py-3">User</th>
                  <th className="text-left px-5 py-3">IP Address</th>
                  <th className="text-left px-5 py-3 hidden sm:table-cell">Details</th>
                  <th className="text-right px-5 py-3">Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => {
                  const style = ACTION_STYLES[log.action] ?? "text-gray-400 bg-white/5 border-white/10";
                  const label = ACTION_LABELS[log.action] ?? log.action;
                  const meta = log.metadata && typeof log.metadata === "object" ? log.metadata as Record<string, unknown> : null;

                  return (
                    <tr key={log.id} className={`border-b border-white/5 last:border-0 ${i % 2 === 1 ? "bg-white/1" : ""}`}>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${style}`}>
                          {label}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-gray-300">{log.username ?? "—"}</td>
                      <td className="px-5 py-3 font-mono text-xs text-gray-400">{log.ip ?? "—"}</td>
                      <td className="px-5 py-3 text-xs text-gray-500 hidden sm:table-cell max-w-xs truncate">
                        {meta
                          ? Object.entries(meta)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(" · ")
                          : "—"}
                      </td>
                      <td className="px-5 py-3 text-right text-xs text-gray-500 whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleString("en-GB", {
                          day: "numeric", month: "short",
                          hour: "2-digit", minute: "2-digit", second: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between text-sm text-gray-500">
              <span>Page {page} of {totalPages}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 border border-white/10 rounded-lg hover:text-white transition-colors disabled:opacity-30"
                >
                  <ChevronLeft size={14} /> Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 border border-white/10 rounded-lg hover:text-white transition-colors disabled:opacity-30"
                >
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
