"use client";
import { usePageView } from "@/hooks/usePageView";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Upload, CheckCircle, ArrowLeft, Send, Lock, MapPin, Clock, Briefcase } from "lucide-react";
import type { JobDetails } from "@/app/careers/apply/page";

type ApplyClientProps = {
  initialRole?: string;
  initialJobId?: string;
  jobDetails?: JobDetails | null;
};

export default function ApplyClient({ initialRole = "", initialJobId = "", jobDetails }: ApplyClientProps) {
  usePageView();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: initialRole,
    linkedin: "",
    portfolio: "",
    message: "",
    currentlyEmployed: "",
    noticePeriod: "",
    yearsOfExperience: "",
    location: "",
  });
  const [bimSoftware, setBimSoftware] = useState<string[]>([]);
  const [otherBim, setOtherBim] = useState(false);
  const [otherBimText, setOtherBimText] = useState("");

  const requirementOptions = jobDetails?.requirements ?? [];

  function handleBimToggle(software: string) {
    setBimSoftware((prev) =>
      prev.includes(software) ? prev.filter((s) => s !== software) : [...prev, software]
    );
  }

  function validateField(name: string, value: string): string {
    switch (name) {
      case "firstName": return value.trim() ? "" : "First name is required.";
      case "lastName": return value.trim() ? "" : "Last name is required.";
      case "email":
        if (!value.trim()) return "Email is required.";
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Please enter a valid email address.";
      case "phone":
        if (!value.trim()) return "Phone number is required.";
        return /^\+?[\d\s\-(). ]{7,20}$/.test(value.trim()) ? "" : "Please enter a valid phone number.";
      case "currentlyEmployed": return value ? "" : "Please select an option.";
      case "yearsOfExperience": return value ? "" : "Please select your experience range.";
      case "location": return value.trim() ? "" : "Current location is required.";
      default: return "";
    }
  }

  function setFieldError(name: string, msg: string) {
    setErrors((prev) => ({ ...prev, [name]: msg }));
  }

  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    const msg = validateField(name, value);
    setFieldError(name, msg);
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (fileError) return;

    // Validate all required fields
    const requiredFields = ["firstName", "lastName", "email", "phone", "currentlyEmployed", "yearsOfExperience", "location"];
    const newErrors: Record<string, string> = {};
    for (const field of requiredFields) {
      const msg = validateField(field, formData[field as keyof typeof formData]);
      if (msg) newErrors[field] = msg;
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData();

    // Append text fields
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    if (initialJobId) data.append("jobId", initialJobId);
    const allBim = [
      ...bimSoftware,
      ...(otherBim && otherBimText.trim() ? [otherBimText.trim()] : []),
    ];
    if (allBim.length > 0) data.append("bimSoftware", allBim.join(","));

    // Append PDF file
    const fileInput = form.querySelector<HTMLInputElement>('input[type="file"]');
    if (fileInput?.files?.[0]) {
      data.append("cv", fileInput.files[0]);
    }

    const res = await fetch("/api/apply", { method: "POST", body: data });
    setSubmitting(false);

    if (!res.ok) {
      const json = await res.json().catch(() => ({})) as { error?: string };
      setSubmitError(json.error ?? "Something went wrong. Please try again.");
      return;
    }

    setFormSubmitted(true);

    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: initialRole,
        linkedin: "",
        portfolio: "",
        message: "",
        currentlyEmployed: "",
        noticePeriod: "",
        yearsOfExperience: "",
        location: "",
      });
      setBimSoftware([]);
      setOtherBim(false);
      setOtherBimText("");
      setFileName(null);
      setErrors({});
      if (fileInput) fileInput.value = "";
    }, 4000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setFieldError(name, validateField(name, value));
  };

  const MAX_CV_BYTES = 5 * 1024 * 1024; // 5 MB

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    if (file.size > MAX_CV_BYTES) {
      setFileError("File is too large. Maximum allowed size is 5 MB.");
    } else {
      setFileError(null);
    }
  };

  return (
    <div className="overflow-x-hidden min-h-screen">
      <div className="max-w-3xl mx-auto px-6 lg:px-8 py-24">
        <Link
          href="/careers"
          className="inline-flex items-center text-gray-400 hover:text-white mb-8 transition-colors z-10 relative"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to Careers
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Apply for{" "}
            <span className="bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] bg-clip-text text-transparent">
              {jobDetails ? jobDetails.title : "Position"}
            </span>
          </h1>

          {/* Job details */}
          {jobDetails && (
            <div className="mb-10 bg-white/3 border border-white/10 rounded-2xl p-6 space-y-4">
              <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Briefcase size={14} className="text-[#00AEEF]" />
                  {jobDetails.department}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#00AEEF]" />
                  {jobDetails.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-[#00AEEF]" />
                  {jobDetails.type}
                </span>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">About this role</p>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {jobDetails.description}
                </p>
              </div>
            </div>
          )}

          <p className="text-gray-400 text-lg mb-10">
            Submit your application below and we&apos;ll reach out to you shortly.
          </p>

          {formSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-[#00AEEF]/10 to-[#00FF9C]/10 border border-[#00FF9C]/50 rounded-2xl p-8 text-center"
            >
              <div className="inline-block p-4 bg-[#00FF9C]/20 rounded-full mb-4">
                <CheckCircle className="text-[#00FF9C]" size={48} />
              </div>
              <h3 className="text-2xl font-bold mb-2">
                Application Submitted!
              </h3>
              <p className="text-gray-400">
                Thank you for applying. We are reviewing your application and
                will get in touch soon.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    First Name *
                  </label>
                  <input
                    type="text" id="firstName" name="firstName" required
                    value={formData.firstName} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-lg focus:outline-none transition-colors text-white ${errors.firstName ? "border-red-500/70 focus:border-red-500" : "border-white/10 focus:border-[#00AEEF]"}`}
                    placeholder="John"
                  />
                  {errors.firstName && <p className="mt-1.5 text-xs text-red-400">{errors.firstName}</p>}
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text" id="lastName" name="lastName" required
                    value={formData.lastName} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-lg focus:outline-none transition-colors text-white ${errors.lastName ? "border-red-500/70 focus:border-red-500" : "border-white/10 focus:border-[#00AEEF]"}`}
                    placeholder="Doe"
                  />
                  {errors.lastName && <p className="mt-1.5 text-xs text-red-400">{errors.lastName}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email" id="email" name="email" required
                    value={formData.email} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-lg focus:outline-none transition-colors text-white ${errors.email ? "border-red-500/70 focus:border-red-500" : "border-white/10 focus:border-[#00AEEF]"}`}
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email}</p>}
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel" id="phone" name="phone" required
                    value={formData.phone} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-lg focus:outline-none transition-colors text-white ${errors.phone ? "border-red-500/70 focus:border-red-500" : "border-white/10 focus:border-[#00AEEF]"}`}
                    placeholder="+387 XX XXX XXX"
                  />
                  {errors.phone && <p className="mt-1.5 text-xs text-red-400">{errors.phone}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-2">
                  Position Applied For *
                  {initialRole && (
                    <span className="ml-2 inline-flex items-center gap-1 text-xs text-gray-500 font-normal">
                      <Lock size={10} /> pre-filled
                    </span>
                  )}
                </label>
                <input
                  type="text" id="role" name="role" required
                  value={formData.role} onChange={handleChange}
                  readOnly={Boolean(initialRole)}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none transition-colors text-white ${
                    initialRole
                      ? "bg-white/5 border-white/5 cursor-not-allowed text-gray-300"
                      : "bg-[#0a0a0a] border-white/10 focus:border-[#00AEEF]"
                  }`}
                  placeholder="e.g. Senior BIM Consultant"
                />
              </div>

              {/* Employment status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="currentlyEmployed" className="block text-sm font-medium mb-2">
                    Currently Employed? *
                  </label>
                  <select
                    id="currentlyEmployed" name="currentlyEmployed"
                    value={formData.currentlyEmployed} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-lg focus:outline-none transition-colors text-white appearance-none ${errors.currentlyEmployed ? "border-red-500/70 focus:border-red-500" : "border-white/10 focus:border-[#00AEEF]"}`}
                  >
                    <option value="">Select an option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No — available immediately</option>
                  </select>
                  {errors.currentlyEmployed && <p className="mt-1.5 text-xs text-red-400">{errors.currentlyEmployed}</p>}
                </div>
                <div>
                  <label htmlFor="noticePeriod" className="block text-sm font-medium mb-2">
                    Notice Period
                    {formData.currentlyEmployed !== "yes" && (
                      <span className="ml-2 text-xs text-gray-500 font-normal">(if applicable)</span>
                    )}
                  </label>
                  <select
                    id="noticePeriod" name="noticePeriod"
                    value={formData.noticePeriod} onChange={handleChange}
                    disabled={formData.currentlyEmployed === "no"}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-[#00AEEF] transition-colors text-white appearance-none disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <option value="">Not applicable / Immediate</option>
                    <option value="2-weeks">2 weeks</option>
                    <option value="1-month">1 month</option>
                    <option value="2-months">2 months</option>
                    <option value="3-months">3 months</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Experience & location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="yearsOfExperience" className="block text-sm font-medium mb-2">
                    Years of Experience *
                  </label>
                  <select
                    id="yearsOfExperience" name="yearsOfExperience"
                    value={formData.yearsOfExperience} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-lg focus:outline-none transition-colors text-white appearance-none ${errors.yearsOfExperience ? "border-red-500/70 focus:border-red-500" : "border-white/10 focus:border-[#00AEEF]"}`}
                  >
                    <option value="">Select range</option>
                    <option value="0-1">Less than 1 year</option>
                    <option value="1-3">1 – 3 years</option>
                    <option value="3-5">3 – 5 years</option>
                    <option value="5-10">5 – 10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                  {errors.yearsOfExperience && <p className="mt-1.5 text-xs text-red-400">{errors.yearsOfExperience}</p>}
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium mb-2">
                    Current Location *
                  </label>
                  <input
                    type="text" id="location" name="location" required
                    value={formData.location} onChange={handleChange} onBlur={handleBlur}
                    className={`w-full px-4 py-3 bg-[#0a0a0a] border rounded-lg focus:outline-none transition-colors text-white ${errors.location ? "border-red-500/70 focus:border-red-500" : "border-white/10 focus:border-[#00AEEF]"}`}
                    placeholder="e.g. Sarajevo, Bosnia"
                  />
                  {errors.location && <p className="mt-1.5 text-xs text-red-400">{errors.location}</p>}
                </div>
              </div>

              {/* Skills & proficiency — only shown if the job defines requirements */}
              {requirementOptions.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-3">
                    Skills & Proficiency
                    <span className="ml-2 text-xs text-gray-500 font-normal">optional — select all that apply</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {requirementOptions.map((option) => {
                      const selected = bimSoftware.includes(option);
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleBimToggle(option)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                            selected
                              ? "bg-[#00AEEF]/15 border-[#00AEEF]/50 text-[#00AEEF]"
                              : "bg-[#0a0a0a] border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => {
                        setOtherBim((prev) => !prev);
                        if (otherBim) setOtherBimText("");
                      }}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                        otherBim
                          ? "bg-[#00AEEF]/15 border-[#00AEEF]/50 text-[#00AEEF]"
                          : "bg-[#0a0a0a] border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
                      }`}
                    >
                      Other
                    </button>
                  </div>
                  {otherBim && (
                    <input
                      type="text"
                      value={otherBimText}
                      onChange={(e) => setOtherBimText(e.target.value)}
                      placeholder="e.g. anything not listed above…"
                      className="mt-3 w-full px-4 py-3 bg-[#0a0a0a] border border-[#00AEEF]/30 rounded-lg focus:outline-none focus:border-[#00AEEF] transition-colors text-white placeholder-gray-600"
                    />
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="linkedin" className="block text-sm font-medium mb-2">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url" id="linkedin" name="linkedin"
                    value={formData.linkedin} onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-[#00AEEF] transition-colors text-white"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <label htmlFor="portfolio" className="block text-sm font-medium mb-2">
                    Portfolio / Website
                  </label>
                  <input
                    type="url" id="portfolio" name="portfolio"
                    value={formData.portfolio} onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-[#00AEEF] transition-colors text-white"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="cv" className="block text-sm font-medium mb-2">
                  Resume / CV (PDF only) *
                </label>
                <div className="relative">
                  <input
                    type="file" id="cv" name="cv" required
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".pdf"
                  />
                  <div className={`w-full px-4 py-8 bg-[#0a0a0a] border border-dashed rounded-lg flex flex-col items-center justify-center pointer-events-none ${fileError ? "border-red-500/50" : "border-white/20"}`}>
                    <Upload className={`mb-2 ${fileError ? "text-red-400" : "text-[#00AEEF]"}`} size={24} />
                    <p className="text-white mb-1 font-medium">
                      {fileName ? fileName : "Upload your resume"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {fileName ? "Click to change file" : "PDF only · max 5 MB"}
                    </p>
                  </div>
                  {fileError && (
                    <p className="mt-2 text-sm text-red-400">{fileError}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Cover Letter / Additional Notes
                </label>
                <textarea
                  id="message" name="message"
                  value={formData.message} onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-[#00AEEF] transition-colors text-white resize-none"
                  placeholder="Tell us why you are a great fit for this role..."
                />
              </div>

              {submitError && (
                <p className="text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">
                  {submitError}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !!fileError}
                className="w-full px-6 py-4 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black font-semibold rounded-lg hover:scale-105 transition-transform flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <span>{submitting ? "Submitting..." : "Submit Application"}</span>
                <Send size={20} />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
