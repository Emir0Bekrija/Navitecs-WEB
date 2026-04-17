"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Upload, CheckCircle, ArrowLeft, Send, Lock } from "lucide-react";

type ApplyClientProps = {
  initialRole?: string;
};

export default function ApplyClient({ initialRole = "" }: ApplyClientProps) {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: initialRole,
    linkedin: "",
    portfolio: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);

    const form = e.currentTarget;
    const data = new FormData();

    // Append text fields
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));

    // Append PDF file
    const fileInput = form.querySelector<HTMLInputElement>('input[type="file"]');
    if (fileInput?.files?.[0]) {
      data.append("cv", fileInput.files[0]);
    }

    await fetch("/api/apply", { method: "POST", body: data });

    setSubmitting(false);
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
      });
      setFileName(null);
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
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFileName(e.target.files[0].name);
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
              Position
            </span>
          </h1>

          <p className="text-gray-400 text-lg mb-12">
            Submit your application to join the NAVITECS team. Fill out the
            fields below and we&apos;ll reach out to you shortly.
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
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    First Name *
                  </label>
                  <input
                    type="text" id="firstName" name="firstName" required
                    value={formData.firstName} onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-[#00AEEF] transition-colors text-white"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text" id="lastName" name="lastName" required
                    value={formData.lastName} onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-[#00AEEF] transition-colors text-white"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email" id="email" name="email" required
                    value={formData.email} onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-[#00AEEF] transition-colors text-white"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel" id="phone" name="phone"
                    value={formData.phone} onChange={handleChange}
                    className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/10 rounded-lg focus:outline-none focus:border-[#00AEEF] transition-colors text-white"
                    placeholder="+387 XX XXX XXX"
                  />
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
                  <div className="w-full px-4 py-8 bg-[#0a0a0a] border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center pointer-events-none">
                    <Upload className="text-[#00AEEF] mb-2" size={24} />
                    <p className="text-white mb-1 font-medium">
                      {fileName ? fileName : "Upload your resume"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {fileName ? "Click to change file" : "PDF only · max 10 MB"}
                    </p>
                  </div>
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

              <button
                type="submit"
                disabled={submitting}
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
