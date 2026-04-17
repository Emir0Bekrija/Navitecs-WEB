"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, FileText, Mail, Phone, Linkedin, Globe } from "lucide-react";
import type { Application } from "@/types/index";

export default function ApplicationsClient() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/applications")
      .then((r) => r.json())
      .then((data: Application[]) => {
        setApplications(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold">Applications</h2>
        <p className="text-gray-400 text-sm mt-0.5">
          {applications.length} total application{applications.length !== 1 ? "s" : ""}
        </p>
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
          <p className="text-gray-400">No applications yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const isExpanded = expandedId === app.id;
            return (
              <div
                key={app.id}
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/3 transition-colors"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : app.id)
                  }
                >
                  <div className="w-10 h-10 rounded-full bg-[#00AEEF]/15 flex items-center justify-center text-[#00AEEF] font-bold shrink-0">
                    {app.firstName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">
                      {app.firstName} {app.lastName}
                    </p>
                    <p className="text-sm text-gray-400 truncate">{app.role}</p>
                  </div>
                  <div className="text-xs text-gray-500 shrink-0 hidden sm:block">
                    {new Date(app.submittedAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
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
                      <div className="flex items-center gap-2 text-sm text-gray-400 bg-white/5 rounded-lg px-3 py-2">
                        <FileText size={14} className="text-[#00FF9C]" />
                        CV: {app.cvFileName}
                      </div>
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

                    <p className="text-xs text-gray-600">
                      Submitted{" "}
                      {new Date(app.submittedAt).toLocaleString("en-GB", {
                        dateStyle: "long",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
