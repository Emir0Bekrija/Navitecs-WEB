"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, MessageSquare, Mail, Phone, Building2 } from "lucide-react";
import type { ContactSubmission } from "@/types/index";

export default function ContactsClient() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/contacts")
      .then((r) => r.json())
      .then((data: ContactSubmission[]) => {
        setContacts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h2 className="text-2xl font-bold">Contact Submissions</h2>
        <p className="text-gray-400 text-sm mt-0.5">
          {contacts.length} total submission{contacts.length !== 1 ? "s" : ""}
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 animate-pulse h-24" />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-12 text-center">
          <MessageSquare className="mx-auto text-gray-600 mb-4" size={40} />
          <p className="text-gray-400">No contact submissions yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => {
            const isExpanded = expandedId === contact.id;
            return (
              <div
                key={contact.id}
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden"
              >
                <button
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-white/3 transition-colors"
                  onClick={() =>
                    setExpandedId(isExpanded ? null : contact.id)
                  }
                >
                  <div className="w-10 h-10 rounded-full bg-[#00FF9C]/15 flex items-center justify-center text-[#00FF9C] font-bold shrink-0">
                    {contact.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white">{contact.name}</p>
                    <p className="text-sm text-gray-400 truncate">
                      {contact.company
                        ? `${contact.company} · ${contact.projectType || contact.email}`
                        : (contact.projectType || contact.email)}
                    </p>
                  </div>
                  <div className="text-xs text-gray-500 shrink-0 hidden sm:block">
                    {new Date(contact.submittedAt).toLocaleDateString("en-GB", {
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
                        <Mail size={14} className="text-[#00FF9C] shrink-0" />
                        <a
                          href={`mailto:${contact.email}`}
                          className="hover:text-[#00FF9C] transition-colors truncate"
                        >
                          {contact.email}
                        </a>
                      </div>
                      {contact.phone && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Phone size={14} className="text-[#00FF9C] shrink-0" />
                          {contact.phone}
                        </div>
                      )}
                      {contact.company && (
                        <div className="flex items-center gap-2 text-gray-300">
                          <Building2 size={14} className="text-[#00FF9C] shrink-0" />
                          {contact.company}
                        </div>
                      )}
                      {contact.projectType && (
                        <div className="text-gray-300">
                          <span className="text-gray-500">Project Type: </span>
                          {contact.projectType}
                        </div>
                      )}
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                        Message
                      </p>
                      <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                        {contact.message}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <a
                        href={`mailto:${contact.email}?subject=Re: ${contact.projectType || "Your inquiry"}`}
                        className="flex items-center gap-2 px-4 py-2 bg-[#00FF9C]/10 border border-[#00FF9C]/20 text-[#00FF9C] rounded-lg text-sm hover:bg-[#00FF9C]/20 transition-colors"
                      >
                        <Mail size={14} />
                        Reply by Email
                      </a>
                      <p className="text-xs text-gray-600">
                        {new Date(contact.submittedAt).toLocaleString("en-GB", {
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
      )}
    </div>
  );
}
