"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, FolderKanban } from "lucide-react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import type { Project } from "@/types/index";

export default function ProjectsAdminClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function loadProjects() {
    const res = await fetch("/api/admin/projects");
    setProjects(await res.json());
    setLoading(false);
  }

  useEffect(() => { loadProjects(); }, []);

  async function deleteProject(id: string) {
    if (!confirm("Delete this project? This cannot be undone.")) return;
    setDeletingId(id);
    await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    setDeletingId(null);
    loadProjects();
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            {projects.length} project{projects.length !== 1 ? "s" : ""} in portfolio
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black font-semibold rounded-xl text-sm hover:opacity-90 transition-opacity"
        >
          <Plus size={16} />
          New Project
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-12 text-center">
          <FolderKanban className="mx-auto text-gray-600 mb-4" size={40} />
          <p className="text-gray-400 mb-4">No projects yet</p>
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black font-semibold rounded-lg text-sm"
          >
            <Plus size={14} />
            Add First Project
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-4 p-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-white/5">
                  {project.image ? (
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FolderKanban size={20} className="text-gray-600" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">
                      {project.title}
                    </h3>
                    <span className="px-2 py-0.5 text-xs bg-[#00AEEF]/15 text-[#00AEEF] rounded-full border border-[#00AEEF]/20 shrink-0">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {project.description}
                  </p>
                  <p className="text-xs text-gray-600 mt-0.5 truncate">
                    {project.scope}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/projects/${project.id}`}
                    target="_blank"
                    title="View on site"
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-white text-xs"
                  >
                    ↗
                  </Link>
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="p-2 rounded-lg hover:bg-white/5 transition-colors text-gray-400 hover:text-[#00AEEF]"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => deleteProject(project.id)}
                    disabled={deletingId === project.id}
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
