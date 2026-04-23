"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Briefcase,
  FileText,
  MessageSquare,
  FolderKanban,
  ArrowRight,
  Clock,
} from "lucide-react";
import type { Job, GroupedApplicant, ContactSubmission, Project } from "@/types/index";

type Stats = {
  totalJobs: number;
  activeJobs: number;
  totalApplications: number;
  totalContacts: number;
  totalProjects: number;
  recentApplications: GroupedApplicant[];
  recentContacts: ContactSubmission[];
};

async function fetchArray(url: string): Promise<unknown[]> {
  const res = await fetch(url);
  if (!res.ok) return [];
  const data: unknown = await res.json();
  return Array.isArray(data) ? data : [];
}

export default function DashboardClient() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function load() {
      const [jobs, apps, contacts, projects] = await Promise.all([
        fetchArray("/api/admin/jobs") as Promise<Job[]>,
        fetch("/api/admin/applications").then(async (r) => {
          if (!r.ok) return [];
          const json = await r.json() as { data?: GroupedApplicant[] };
          return Array.isArray(json.data) ? json.data : [];
        }),
        fetchArray("/api/admin/contacts") as Promise<ContactSubmission[]>,
        fetchArray("/api/admin/projects") as Promise<Project[]>,
      ]);
      setStats({
        totalJobs: jobs.length,
        activeJobs: jobs.filter((j) => j.active).length,
        totalApplications: apps.length,
        totalContacts: contacts.length,
        totalProjects: projects.length,
        recentApplications: apps.slice(0, 5),
        recentContacts: contacts.slice(0, 5),
      });
    }
    load();
  }, []);

  const statCards = stats
    ? [
        {
          label: "Active Job Postings",
          value: stats.activeJobs,
          sub: `${stats.totalJobs} total`,
          icon: Briefcase,
          href: "/navitecs-control-admin/jobs",
          color: "#00AEEF",
        },
        {
          label: "Applications",
          value: stats.totalApplications,
          sub: "total received",
          icon: FileText,
          href: "/navitecs-control-admin/applications",
          color: "#00FF9C",
        },
        {
          label: "Contact Submissions",
          value: stats.totalContacts,
          sub: "total received",
          icon: MessageSquare,
          href: "/navitecs-control-admin/contacts",
          color: "#00AEEF",
        },
        {
          label: "Projects",
          value: stats.totalProjects,
          sub: "in portfolio",
          icon: FolderKanban,
          href: "/navitecs-control-admin/projects",
          color: "#00FF9C",
        },
      ]
    : [];

  return (
    <div className="space-y-8 max-w-6xl">
      <div>
        <h2 className="text-2xl font-bold mb-1">Dashboard</h2>
        <p className="text-gray-400 text-sm">
          Overview of your site activity
        </p>
      </div>

      {/* Stats */}
      {stats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(({ label, value, sub, icon: Icon, href, color }) => (
            <Link
              key={label}
              href={href}
              className="group bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${color}18` }}
                >
                  <Icon size={20} style={{ color }} />
                </div>
                <ArrowRight
                  size={16}
                  className="text-gray-600 group-hover:text-gray-400 transition-colors"
                />
              </div>
              <div
                className="text-3xl font-bold mb-1"
                style={{ color }}
              >
                {value}
              </div>
              <div className="text-sm font-medium text-white">{label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{sub}</div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 animate-pulse h-36"
            />
          ))}
        </div>
      )}

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Applications */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold">Recent Applications</h3>
            <Link
              href="/navitecs-control-admin/applications"
              className="text-xs text-[#00AEEF] hover:text-[#00FF9C] transition-colors"
            >
              View all →
            </Link>
          </div>
          {stats?.recentApplications.length === 0 ? (
            <p className="text-gray-500 text-sm">No applications yet</p>
          ) : (
            <div className="space-y-3">
              {stats?.recentApplications.map((app) => (
                <div
                  key={app.id}
                  className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-[#00AEEF]/15 flex items-center justify-center text-[#00AEEF] text-xs font-bold shrink-0">
                    {app.firstName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {app.firstName} {app.lastName}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{app.applications[0]?.role}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
                    <Clock size={11} />
                    {new Date(app.applications[0]?.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Contacts */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold">Recent Contact Requests</h3>
            <Link
              href="/navitecs-control-admin/contacts"
              className="text-xs text-[#00AEEF] hover:text-[#00FF9C] transition-colors"
            >
              View all →
            </Link>
          </div>
          {stats?.recentContacts.length === 0 ? (
            <p className="text-gray-500 text-sm">No contact requests yet</p>
          ) : (
            <div className="space-y-3">
              {stats?.recentContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0"
                >
                  <div className="w-8 h-8 rounded-full bg-[#00FF9C]/15 flex items-center justify-center text-[#00FF9C] text-xs font-bold shrink-0">
                    {contact.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{contact.name}</p>
                    <p className="text-xs text-gray-400 truncate">
                      {contact.projectType || contact.email}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 shrink-0">
                    <Clock size={11} />
                    {new Date(contact.submittedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
