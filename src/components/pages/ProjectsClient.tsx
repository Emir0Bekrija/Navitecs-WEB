"use client";
import { usePageView } from "@/hooks/usePageView";

import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { Building2, Filter, ArrowRight, MapPin, Clock } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { projects as staticProjects } from "../../data/projects";
import type { Project } from "@/types/index";

type Props = { initialProjects?: Project[] };

const FILTERS = ["All", "Residential", "Commercial", "Industrial", "Healthcare", "Infrastructure", "MEP"];

export default function ProjectsClient({ initialProjects }: Props) {
  usePageView();
  const projects = initialProjects ?? staticProjects;
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredProjects =
    activeFilter === "All"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#00AEEF]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00FF9C]/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] bg-clip-text text-transparent">
                Projects
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Explore our portfolio of successfully delivered BIM coordination and engineering projects
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="py-12 sticky top-20 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Filter className="text-gray-400" size={20} />
            {FILTERS.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-lg font-medium transition-all text-sm ${
                  activeFilter === filter
                    ? "bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black"
                    : "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
                layout
                className="group relative bg-black border border-white/10 rounded-2xl overflow-hidden hover:border-[#00AEEF]/50 transition-all flex flex-col"
              >
                <Link href={`/projects/${project.id}`} className="absolute inset-0 z-10">
                  <span className="sr-only">View {project.title} case study</span>
                </Link>

                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-white/5">
                  <ImageWithFallback
                    src={project.featuredImage ?? ""}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  {/* Featured badge */}
                  {project.featured && (
                    <div className="absolute top-3 left-3 px-2 py-1 text-xs font-semibold bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black rounded-md z-10">
                      Featured
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-2 relative z-20">
                    <span className="text-xs font-semibold text-[#00AEEF] uppercase tracking-wider">
                      {project.category}
                    </span>
                    <Building2 className="text-gray-600" size={16} />
                  </div>

                  <h3 className="text-lg font-semibold mb-2 group-hover:text-[#00AEEF] transition-colors relative z-20 leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-gray-400 text-sm mb-4 flex-1 relative z-20 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Meta row */}
                  {(project.location || project.timeline) && (
                    <div className="flex flex-wrap gap-3 mb-4 relative z-20">
                      {project.location && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin size={11} />
                          {project.location}
                        </span>
                      )}
                      {project.timeline && (
                        <span className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock size={11} />
                          {project.timeline}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Scope pills */}
                  <div className="pt-4 border-t border-white/10 relative z-20">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
                        {project.scopeOfWork.slice(0, 2).map((s) => (
                          <span key={s} className="text-xs px-2 py-0.5 bg-white/5 rounded text-gray-400 truncate max-w-[120px]">
                            {s}
                          </span>
                        ))}
                        {project.scopeOfWork.length > 2 && (
                          <span className="text-xs px-2 py-0.5 bg-white/5 rounded text-gray-500">
                            +{project.scopeOfWork.length - 2}
                          </span>
                        )}
                      </div>
                      <ArrowRight className="text-gray-600 group-hover:text-[#00AEEF] transition-colors group-hover:translate-x-1 w-5 h-5 shrink-0" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No projects found in this category.</p>
            </div>
          )}
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Completed Projects" },
              { value: "100%", label: "BIM Coordinated" },
              { value: "50+", label: "Active Clients" },
              { value: "15+", label: "Years Experience" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
