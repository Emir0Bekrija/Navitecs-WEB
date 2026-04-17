"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  ToggleRight,
  MapPin,
  Clock,
  Briefcase,
} from "lucide-react";
import type { Job } from "@/types/index";

export default function JobsClient() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadJobs() {
    const res = await fetch("/api/admin/jobs");
    setJobs(await res.json());
    setLoading(false);
  }

  useEffect(() => { loadJobs(); }, []);

  async function toggleActive(job: Job) {
    await fetch(`/api/admin/jobs/${job.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !job.active }),
    });
    loadJobs();
  }

  async function deleteJob(id: string) {
    if (!confirm("Delete this job posting? This cannot be undone.")) return;
    setDeletingId(id);
    await fetch(`/api/admin/jobs/${id}`, { method: "DELETE" });
    setDeletingId(null);
    loadJobs();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Job Postings</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {jobs.filter((j) => j.active).length} active ·{" "}
            {jobs.length} total
          </p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          New Job
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 animate-pulse h-28" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-12 text-center">
          <Briefcase className="mx-auto text-gray-600 mb-4" size={40} />
          <p className="text-gray-400 mb-4">No job postings yet</p>
          <Link
            href="/admin/jobs/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black font-semibold rounded-lg text-sm"
          >
            <Plus size={14} />
            Create First Job
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`bg-[#0a0a0a] border rounded-2xl p-5 transition-all ${
                job.active ? "border-white/10" : "border-white/5 opacity-60"
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <h3 className="font-semibold text-white">{job.title}</h3>
                    {job.active ? (
                      <span className="px-2 py-0.5 text-xs bg-[#00FF9C]/15 text-[#00FF9C] rounded-full border border-[#00FF9C]/20">
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 text-xs bg-white/5 text-gray-500 rounded-full border border-white/10">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                    {job.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <MapPin size={11} />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} />
                      {job.type}
                    </span>
                    <span className="text-gray-600">{job.department}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(job)}
                    title={job.active ? "Deactivate" : "Activate"}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                  >
                    {job.active ? (
                      <ToggleRight size={20} className="text-[#00FF9C]" />
                    ) : (
                      <ToggleLeft size={20} />
                    )}
                  </button>
                  <Link
                    href={`/admin/jobs/${job.id}/edit`}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-[#00AEEF]"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => deleteJob(job.id)}
                    disabled={deletingId === job.id}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-gray-400 hover:text-red-400 disabled:opacity-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
