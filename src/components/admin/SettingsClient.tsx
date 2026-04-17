"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, SendHorizonal, CheckCircle, AlertCircle, Eye, EyeOff } from "lucide-react";

const inputClass =
  "w-full px-4 py-3 bg-black border border-white/15 rounded-lg focus:outline-none focus:border-[#00AEEF] transition-colors text-white placeholder-gray-600 text-sm";
const labelClass = "block text-sm font-medium text-gray-300 mb-2";

export default function SettingsClient() {
  const [form, setForm] = useState({
    host: "",
    port: 587,
    secure: false,
    user: "",
    password: "",
    fromName: "NAVITECS",
    fromEmail: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "ok" | "error">("idle");
  const [testEmail, setTestEmail] = useState("");
  const [testing, setTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "ok" | "error">("idle");
  const [testError, setTestError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((cfg) => {
        setForm(cfg);
        setLoading(false);
      });
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : name === "port"
          ? Number(value)
          : value,
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveStatus("idle");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaveStatus(res.ok ? "ok" : "error");
    if (res.ok) setTimeout(() => setSaveStatus("idle"), 3000);
  }

  async function handleTest() {
    if (!testEmail) return;
    setTesting(true);
    setTestStatus("idle");
    setTestError("");
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ testEmail }),
    });
    setTesting(false);
    if (res.ok) {
      setTestStatus("ok");
      setTimeout(() => setTestStatus("idle"), 4000);
    } else {
      const data = await res.json();
      setTestError(data.error || "Test failed");
      setTestStatus("error");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-[#00AEEF]" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-gray-400 text-sm mt-0.5">Configure SMTP for sending email replies</p>
      </div>

      <form onSubmit={handleSave} className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-5">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          SMTP Configuration
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="sm:col-span-2">
            <label htmlFor="host" className={labelClass}>SMTP Host</label>
            <input id="host" name="host" value={form.host} onChange={handleChange}
              placeholder="smtp.gmail.com" className={inputClass} />
          </div>
          <div>
            <label htmlFor="port" className={labelClass}>Port</label>
            <input id="port" name="port" type="number" value={form.port} onChange={handleChange}
              placeholder="587" className={inputClass} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input type="checkbox" id="secure" name="secure" checked={form.secure}
            onChange={handleChange} className="w-4 h-4 accent-[#00AEEF]" />
          <label htmlFor="secure" className="text-sm text-gray-300">
            Use SSL/TLS (port 465)
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="user" className={labelClass}>Username / Email</label>
            <input id="user" name="user" value={form.user} onChange={handleChange}
              placeholder="your@gmail.com" className={inputClass} />
          </div>
          <div>
            <label htmlFor="password" className={labelClass}>Password / App Password</label>
            <div className="relative">
              <input id="password" name="password" type={showPassword ? "text" : "password"}
                value={form.password} onChange={handleChange}
                placeholder="••••••••" className={`${inputClass} pr-10`} />
              <button type="button" onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="fromName" className={labelClass}>From Name</label>
            <input id="fromName" name="fromName" value={form.fromName} onChange={handleChange}
              placeholder="NAVITECS" className={inputClass} />
          </div>
          <div>
            <label htmlFor="fromEmail" className={labelClass}>From Email</label>
            <input id="fromEmail" name="fromEmail" type="email" value={form.fromEmail}
              onChange={handleChange} placeholder="info@navitecs.ba" className={inputClass} />
          </div>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black font-semibold rounded-xl text-sm hover:opacity-90 disabled:opacity-50">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving..." : "Save Settings"}
          </button>
          {saveStatus === "ok" && (
            <span className="flex items-center gap-1.5 text-sm text-[#00FF9C]">
              <CheckCircle size={14} /> Saved
            </span>
          )}
          {saveStatus === "error" && (
            <span className="text-sm text-red-400">Save failed</span>
          )}
        </div>
      </form>

      {/* Test email */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Test Email
        </h3>
        <p className="text-sm text-gray-400">
          Send a test message to verify your SMTP config is working.
        </p>
        <div className="flex gap-3">
          <input
            value={testEmail}
            onChange={(e) => setTestEmail(e.target.value)}
            type="email"
            placeholder="test@example.com"
            className={`${inputClass} flex-1`}
          />
          <button
            onClick={handleTest}
            disabled={testing || !testEmail}
            className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50 shrink-0"
          >
            {testing ? <Loader2 size={14} className="animate-spin" /> : <SendHorizonal size={14} />}
            {testing ? "Sending..." : "Send Test"}
          </button>
        </div>
        {testStatus === "ok" && (
          <div className="flex items-center gap-2 text-[#00FF9C] text-sm">
            <CheckCircle size={14} /> Test email sent successfully!
          </div>
        )}
        {testStatus === "error" && (
          <div className="flex items-center gap-2 text-red-400 text-sm">
            <AlertCircle size={14} /> {testError}
          </div>
        )}
      </div>

      {/* Provider hints */}
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Common Providers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-gray-500">
          <div><span className="text-gray-300 font-medium">Gmail:</span> smtp.gmail.com · 587 · use App Password</div>
          <div><span className="text-gray-300 font-medium">Outlook:</span> smtp.office365.com · 587</div>
          <div><span className="text-gray-300 font-medium">Yahoo:</span> smtp.mail.yahoo.com · 587</div>
          <div><span className="text-gray-300 font-medium">Brevo:</span> smtp-relay.brevo.com · 587</div>
        </div>
        <p className="text-xs text-gray-600">
          For Gmail, generate an App Password at myaccount.google.com → Security → 2-Step Verification → App passwords.
        </p>
      </div>
    </div>
  );
}
