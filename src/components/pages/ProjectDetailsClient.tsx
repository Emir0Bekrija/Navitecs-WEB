"use client";
import { usePageView } from "@/hooks/usePageView";

import { motion } from "framer-motion";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, ChevronRight, Download } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { projects as staticProjects } from "../../data/projects";
import type { Project } from "@/types/index";

type Props = { allProjects?: Project[] };

export default function ProjectDetailsClient({ allProjects }: Props) {
  usePageView();
  const projects = allProjects ?? (staticProjects as Project[]);
  const params = useParams();
  const id =
    typeof params.id === "string"
      ? params.id
      : Array.isArray(params.id)
        ? params.id[0]
        : "";
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center">
        <div>
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Link
            href="/projects"
            className="text-[#00AEEF] hover:text-[#00FF9C] transition-colors inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-x-hidden pb-24">
      <section className="relative min-h-[60vh] flex items-center pt-32 pb-20 justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00AEEF]/10 rounded-full blur-[100px] opacity-60 mix-blend-screen pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#00FF9C]/10 rounded-full blur-[100px] opacity-60 mix-blend-screen pointer-events-none" />
          <div className="absolute inset-0 bg-black/40 z-10" />
          <ImageWithFallback
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover absolute inset-0"
          />
        </div>

        <div className="relative z-20 max-w-7xl mx-auto px-6 lg:px-8 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Link
              href="/projects"
              className="inline-flex items-center text-gray-300 hover:text-white mb-6 group transition-colors"
            >
              <ArrowLeft className="mr-2 h-5 w-5 group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </Link>

            <div className="flex items-center gap-3 mb-6">
              <span className="px-3 py-1 text-xs bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black font-semibold rounded-lg">
                {project.category}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white max-w-4xl">
              {project.title}
            </h1>

            <p className="text-xl text-gray-200 max-w-3xl">
              {project.description}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 -mt-10 relative z-30">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <span className="bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] w-1.5 h-6 mr-3 rounded-full" />
                The Challenge
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                {project.caseStudy?.challenge}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
            >
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <span className="bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] w-1.5 h-6 mr-3 rounded-full" />
                The Solution
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-8">
                {project.caseStudy?.solution}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <span className="bg-gradient-to-r from-[#00FF9C] to-[#00AEEF] w-1.5 h-6 mr-3 rounded-full" />
                Impact & Results
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {project.caseStudy?.results.map((result, idx) => (
                  <div
                    key={idx}
                    className="bg-white/5 border border-white/10 p-5 rounded-xl flex items-start gap-3"
                  >
                    <CheckCircle2 className="text-[#00FF9C] w-6 h-6 shrink-0 mt-0.5" />
                    <p className="text-gray-200">{result}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sticky top-24"
            >
              <h3 className="text-lg font-semibold mb-4 border-b border-white/10 pb-4">
                Project Overview
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                    Category
                  </p>
                  <p className="text-white font-medium">{project.category}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wider mb-1">
                    Scope of Work
                  </p>
                  <p className="text-white">{project.scope}</p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10">
                <button
                  type="button"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors text-white text-sm font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download Case Study
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 mt-12 bg-white/5">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to start your next{" "}
            <span className="bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] bg-clip-text text-transparent">
              project?
            </span>
          </h2>
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Partner with us to bring your vision to life through innovative BIM
            coordination and engineering solutions.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black font-semibold rounded-xl hover:shadow-[0_0_20px_rgba(0,174,239,0.3)] transition-all hover:-translate-y-1"
          >
            Contact Us
            <ChevronRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
