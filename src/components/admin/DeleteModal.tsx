"use client";

import { useEffect, useRef, useState } from "react";
import { Trash2, X, AlertTriangle, Lock } from "lucide-react";

type Props = {
  /** Name of the item shown in the confirmation message */
  itemName: string;
  /** Called after password is verified — perform the actual delete here */
  onConfirm: () => Promise<void>;
  onClose: () => void;
};

type Step = "confirm" | "password";

export default function DeleteModal({ itemName, onConfirm, onClose }: Props) {
  const [step, setStep] = useState<Step>("confirm");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus the password input when the step changes
  useEffect(() => {
    if (step === "password") {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [step]);

  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleDelete() {
    if (!password) {
      setError("Please enter your password.");
      return;
    }
    setLoading(true);
    setError(null);

    const res = await fetch("/api/admin/verify-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!res.ok) {
      setLoading(false);
      setError("Incorrect password. Try again.");
      setPassword("");
      inputRef.current?.focus();
      return;
    }

    await onConfirm();
    setLoading(false);
    onClose();
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            {step === "confirm" ? (
              <div className="w-9 h-9 rounded-xl bg-red-500/15 flex items-center justify-center">
                <AlertTriangle size={18} className="text-red-400" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-xl bg-orange-500/15 flex items-center justify-center">
                <Lock size={18} className="text-orange-400" />
              </div>
            )}
            <h2 className="font-semibold text-white">
              {step === "confirm" ? "Delete item?" : "Confirm your identity"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/5 text-gray-500 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {step === "confirm" ? (
            <div className="space-y-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                Are you sure you want to permanently delete{" "}
                <span className="text-white font-medium">&ldquo;{itemName}&rdquo;</span>?
                This action cannot be undone.
              </p>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 border border-white/10 text-gray-300 rounded-xl text-sm hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep("password")}
                  className="flex-1 px-4 py-2.5 bg-red-500/15 border border-red-500/30 text-red-400 rounded-xl text-sm font-medium hover:bg-red-500/25 transition-colors"
                >
                  Yes, delete it
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-gray-300 text-sm leading-relaxed">
                Enter your admin password to confirm deletion of{" "}
                <span className="text-white font-medium">&ldquo;{itemName}&rdquo;</span>.
              </p>
              <div>
                <input
                  ref={inputRef}
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  onKeyDown={(e) => { if (e.key === "Enter") handleDelete(); }}
                  placeholder="Admin password"
                  className={`w-full bg-[#111] border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none transition-colors ${
                    error ? "border-red-500/50 focus:border-red-500/70" : "border-white/10 focus:border-white/25"
                  }`}
                />
                {error && (
                  <p className="mt-2 text-xs text-red-400">{error}</p>
                )}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => { setStep("confirm"); setPassword(""); setError(null); }}
                  className="flex-1 px-4 py-2.5 border border-white/10 text-gray-300 rounded-xl text-sm hover:bg-white/5 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handleDelete}
                  disabled={loading || !password}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 size={14} />
                  {loading ? "Deleting…" : "Delete"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
