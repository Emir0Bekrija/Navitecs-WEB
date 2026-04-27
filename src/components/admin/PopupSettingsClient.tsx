"use client";

import { useEffect, useState } from "react";
import {
  Save,
  Loader2,
  CheckCircle,
  Eye,
  EyeOff,
  ToggleLeft,
  ToggleRight,
  ExternalLink,
  Link as LinkIcon,
  X,
  ArrowRight,
} from "lucide-react";

type PopupConfig = {
  enabled: boolean;
  badge: string;
  category: string;
  title: string;
  description: string;
  buttonText: string;
  linkUrl: string;
  linkType: "internal" | "external";
  openInNewTab: boolean;
};

const DEFAULT: PopupConfig = {
  enabled: false,
  badge: "INSIGHT",
  category: "",
  title: "New BIM Coordination Insight",
  description:
    "See how coordinated Revit models help reduce clashes, improve documentation accuracy, and streamline collaboration across architectural, structural, and MEP teams.",
  buttonText: "Read the article",
  linkUrl: "",
  linkType: "external",
  openInNewTab: true,
};

const inputClass =
  "w-full px-4 py-3 bg-black border border-white/15 rounded-lg focus:outline-none focus:border-[#00AEEF] transition-colors text-white placeholder-gray-600 text-sm";
const labelClass = "block text-sm font-medium text-gray-300 mb-2";

export default function PopupSettingsClient() {
  const [form, setForm] = useState<PopupConfig>(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "ok" | "error">("idle");
  const [previewVisible, setPreviewVisible] = useState(false);

  useEffect(() => {
    fetch("/api/admin/popup")
      .then((r) => r.json())
      .then((cfg: PopupConfig) => {
        setForm(cfg);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaveStatus("idle");
    const res = await fetch("/api/admin/popup", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaveStatus(res.ok ? "ok" : "error");
    if (res.ok) setTimeout(() => setSaveStatus("idle"), 3000);
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
        <h2 className="text-2xl font-bold">Promotional Popup</h2>
        <p className="text-gray-400 text-sm mt-0.5">
          Manage the floating insight popup shown on the public site. The popup appears on every page load.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Enable/disable */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white">Enable popup</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Show the promotional popup on the public site
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm((prev) => ({ ...prev, enabled: !prev.enabled }))}
              className="shrink-0"
              aria-label={form.enabled ? "Disable popup" : "Enable popup"}
            >
              {form.enabled ? (
                <ToggleRight size={36} className="text-[#00FF9C]" />
              ) : (
                <ToggleLeft size={36} className="text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Content</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="badge" className={labelClass}>Badge text</label>
              <input
                id="badge"
                name="badge"
                value={form.badge}
                onChange={handleChange}
                placeholder="INSIGHT"
                maxLength={50}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="category" className={labelClass}>
                Category <span className="text-gray-600 font-normal">(optional)</span>
              </label>
              <input
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="BIM Coordination"
                maxLength={100}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="title" className={labelClass}>Title</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="New BIM Coordination Insight"
              maxLength={255}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short compelling description..."
              rows={4}
              className={`${inputClass} resize-y`}
            />
          </div>
        </div>

        {/* CTA */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Call to Action
          </h3>

          <div>
            <label htmlFor="buttonText" className={labelClass}>Button text</label>
            <input
              id="buttonText"
              name="buttonText"
              value={form.buttonText}
              onChange={handleChange}
              placeholder="Read the article"
              maxLength={100}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="linkUrl" className={labelClass}>Link URL</label>
            <input
              id="linkUrl"
              name="linkUrl"
              value={form.linkUrl}
              onChange={handleChange}
              placeholder="https://example.com/article or /projects/bim-coordination"
              maxLength={500}
              className={inputClass}
            />
            <p className="text-xs text-gray-600 mt-1.5">
              Full URL for external links, or a path like{" "}
              <code className="text-gray-500">/projects/my-project</code> for internal links.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="linkType" className={labelClass}>Link type</label>
              <div className="relative">
                <select
                  id="linkType"
                  name="linkType"
                  value={form.linkType}
                  onChange={handleChange}
                  className={`${inputClass} appearance-none cursor-pointer pr-10`}
                >
                  <option value="external">External URL</option>
                  <option value="internal">Internal page / project / service</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                  {form.linkType === "external" ? (
                    <ExternalLink size={14} />
                  ) : (
                    <LinkIcon size={14} />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 sm:pt-8">
              <input
                type="checkbox"
                id="openInNewTab"
                name="openInNewTab"
                checked={form.openInNewTab}
                onChange={handleChange}
                className="w-4 h-4 accent-[#00AEEF] shrink-0"
              />
              <label htmlFor="openInNewTab" className="text-sm text-gray-300 cursor-pointer">
                Open in new tab
              </label>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Preview</h3>
            <button
              type="button"
              onClick={() => setPreviewVisible((v) => !v)}
              className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              {previewVisible ? <EyeOff size={13} /> : <Eye size={13} />}
              {previewVisible ? "Hide" : "Show"} preview
            </button>
          </div>

          {previewVisible && (
            <div>
              <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-xl bg-black/55 backdrop-blur-xl max-w-[340px]">
                <div
                  className="absolute inset-0 animate-liquid-gradient opacity-[0.12]"
                  style={{
                    backgroundImage: "linear-gradient(135deg, #00AEEF, #00FF9C, #00AEEF, #009cd6, #00FF9C)",
                  }}
                  aria-hidden="true"
                />
                <div className="absolute inset-0 bim-grid-overlay opacity-60" aria-hidden="true" />
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] opacity-70" aria-hidden="true" />
                <div className="relative z-10 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold tracking-widest uppercase bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black">
                      {form.badge || "INSIGHT"}
                    </span>
                    {form.category && (
                      <span className="text-[11px] text-gray-400 font-medium truncate flex-1">
                        {form.category}
                      </span>
                    )}
                    <div className="ml-auto p-1.5 rounded-lg text-gray-500 shrink-0">
                      <X size={14} />
                    </div>
                  </div>
                  <h3 className="text-[15px] font-semibold text-white leading-snug mb-3">
                    {form.title || "Popup title"}
                  </h3>
                  <div className="rounded-xl bg-black/40 border border-white/[0.08] px-4 py-3 mb-4">
                    <p className="text-[12.5px] text-gray-300 leading-relaxed">
                      {form.description || "Popup description will appear here."}
                    </p>
                  </div>
                  <div className="inline-flex items-center gap-2 w-full justify-center px-4 py-2.5 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black text-sm font-semibold rounded-xl">
                    {form.buttonText || "Read the article"}
                    {form.linkType === "external" ? (
                      <ExternalLink size={13} className="opacity-80" />
                    ) : (
                      <ArrowRight size={13} className="opacity-80" />
                    )}
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Positioning and animation are only visible on the live site.
              </p>
            </div>
          )}
        </div>

        {/* Save */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black font-semibold rounded-xl text-sm hover:opacity-90 disabled:opacity-50"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? "Saving..." : "Save Popup"}
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
    </div>
  );
}
