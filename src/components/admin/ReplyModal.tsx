"use client";

import { useState } from "react";
import { X, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";

type Props = {
  to: string;
  defaultSubject?: string;
  onClose: () => void;
};

export default function ReplyModal({ to, defaultSubject = "", onClose }: Props) {
  const [subject, setSubject] = useState(defaultSubject);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSend() {
    if (!subject.trim() || !message.trim()) return;
    setStatus("sending");

    const res = await fetch("/api/admin/email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ to, subject, message }),
    });

    if (res.ok) {
      setStatus("sent");
      setTimeout(onClose, 1800);
    } else {
      const data = await res.json();
      setErrorMsg(data.error || "Failed to send");
      setStatus("error");
    }
  }

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-[#0a0a0a] border border-white/15 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h3 className="font-semibold text-white">Reply</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">To</label>
            <div className="px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
              {to}
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Subject</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-black border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-[#00AEEF] transition-colors"
              placeholder="Subject..."
            />
          </div>

          <div>
            <label className="block text-xs text-gray-500 uppercase tracking-wider mb-1.5">Message</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={7}
              className="w-full px-3 py-2 bg-black border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-[#00AEEF] transition-colors resize-none"
              placeholder="Write your reply..."
              autoFocus
            />
          </div>

          {status === "error" && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <AlertCircle size={14} />
              {errorMsg}
            </div>
          )}

          {status === "sent" && (
            <div className="flex items-center gap-2 text-[#00FF9C] text-sm bg-[#00FF9C]/10 border border-[#00FF9C]/20 rounded-lg px-3 py-2">
              <CheckCircle size={14} />
              Email sent successfully
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={status === "sending" || status === "sent" || !subject.trim() || !message.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {status === "sending" ? (
              <Loader2 size={14} className="animate-spin" />
            ) : status === "sent" ? (
              <CheckCircle size={14} />
            ) : (
              <Send size={14} />
            )}
            {status === "sending" ? "Sending..." : status === "sent" ? "Sent!" : "Send Reply"}
          </button>
        </div>
      </div>
    </div>
  );
}
