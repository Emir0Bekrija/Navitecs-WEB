"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react";
import type { Project } from "@/types/index";

type Props = { projectId?: string };

const inputClass =
  "w-full px-4 py-3 bg-black border border-white/15 rounded-lg focus:outline-none focus:border-[#00AEEF] transition-colors text-white placeholder-gray-600";
const labelClass = "block text-sm font-medium text-gray-300 mb-2";

const CATEGORIES = ["Residential", "Commercial", "Infrastructure", "MEP"];

export default function ProjectFormClient({ projectId }: Props) {
  const router = useRouter();
  const isEdit = Boolean(projectId);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "",
    category: "Commercial",
    description: "",
    scope: "",
    image: "",
    challenge: "",
    solution: "",
    results: [""],
  });

  useEffect(() => {
    if (!projectId) return;
    fetch(`/api/admin/projects/${projectId}`)
      .then((r) => r.json())
      .then((p: Project) => {
        setForm({
          title: p.title,
          category: p.category,
          description: p.description,
          scope: p.scope,
          image: p.image,
          challenge: p.caseStudy?.challenge ?? "",
          solution: p.caseStudy?.solution ?? "",
          results:
            p.caseStudy?.results?.length > 0 ? p.caseStudy.results : [""],
        });
        setLoading(false);
      });
  }, [projectId]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function setResult(idx: number, value: string) {
    setForm((prev) => {
      const results = [...prev.results];
      results[idx] = value;
      return { ...prev, results };
    });
  }

  function addResult() {
    setForm((prev) => ({ ...prev, results: [...prev.results, ""] }));
  }

  function removeResult(idx: number) {
    setForm((prev) => ({
      ...prev,
      results: prev.results.filter((_, i) => i !== idx),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      title: form.title,
      category: form.category,
      description: form.description,
      scope: form.scope,
      image: form.image,
      caseStudy: {
        challenge: form.challenge,
        solution: form.solution,
        results: form.results.filter((r) => r.trim()),
      },
    };

    const url = isEdit
      ? `/api/admin/projects/${projectId}`
      : "/api/admin/projects";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/navitecs-control-admin/projects");
    } else {
      const data = await res.json();
      setError(data.error || "Save failed");
      setSaving(false);
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
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/navitecs-control-admin/projects"
          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={16} />
          Back to Projects
        </Link>
      </div>

      <div>
        <h2 className="text-2xl font-bold">
          {isEdit ? "Edit Project" : "New Project"}
        </h2>
        <p className="text-gray-400 text-sm mt-0.5">
          {isEdit ? "Update this project and case study" : "Add a new project to the portfolio"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic info */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Project Info
          </h3>

          <div>
            <label htmlFor="title" className={labelClass}>Title *</label>
            <input
              id="title" name="title" required
              value={form.title} onChange={handleChange}
              placeholder="e.g. Office Building Marijin Dvor"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="category" className={labelClass}>Category *</label>
              <select
                id="category" name="category"
                value={form.category} onChange={handleChange}
                className={inputClass}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c} className="bg-[#111]">{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="scope" className={labelClass}>Scope of Work *</label>
              <input
                id="scope" name="scope" required
                value={form.scope} onChange={handleChange}
                placeholder="e.g. BIM Coordination, MEP Design"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className={labelClass}>Description *</label>
            <textarea
              id="description" name="description" required
              value={form.description} onChange={handleChange}
              rows={3}
              placeholder="Brief overview of the project..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label htmlFor="image" className={labelClass}>Image URL</label>
            <input
              id="image" name="image" type="url"
              value={form.image} onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className={inputClass}
            />
          </div>
        </div>

        {/* Case Study */}
        <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            Case Study
          </h3>

          <div>
            <label htmlFor="challenge" className={labelClass}>The Challenge</label>
            <textarea
              id="challenge" name="challenge"
              value={form.challenge} onChange={handleChange}
              rows={3}
              placeholder="What was the main challenge of this project?"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label htmlFor="solution" className={labelClass}>The Solution</label>
            <textarea
              id="solution" name="solution"
              value={form.solution} onChange={handleChange}
              rows={4}
              placeholder="How did NAVITECS solve this challenge?"
              className={`${inputClass} resize-none`}
            />
          </div>

          <div>
            <label className={labelClass}>Results</label>
            <div className="space-y-2">
              {form.results.map((result, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    value={result}
                    onChange={(e) => setResult(idx, e.target.value)}
                    placeholder={`Result ${idx + 1}...`}
                    className={`${inputClass} flex-1`}
                  />
                  {form.results.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeResult(idx)}
                      className="p-3 rounded-lg bg-white/5 hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors shrink-0"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addResult}
                className="flex items-center gap-2 text-sm text-[#00AEEF] hover:text-[#00FF9C] transition-colors mt-2"
              >
                <Plus size={14} />
                Add result
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {saving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Save size={16} />
            )}
            {saving ? "Saving..." : isEdit ? "Save Changes" : "Create Project"}
          </button>
          <Link
            href="/navitecs-control-admin/projects"
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-medium hover:bg-white/10 transition-colors"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
