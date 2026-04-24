"use client";
import { usePageView } from "@/hooks/usePageView";

import { motion } from "framer-motion";
import { Target, Eye, Layers, Users, Award, CheckCircle } from "lucide-react";
import { ImageWithFallback } from "../figma/ImageWithFallback";

export default function AboutClient() {
  usePageView();
  const milestones = [
    {
      year: "2009",
      title: "Company Founded",
      description: "NAVITECS established in Sarajevo",
    },
    {
      year: "2012",
      title: "BIM Integration",
      description: "Adopted advanced BIM workflows and technologies",
    },
    {
      year: "2015",
      title: "Regional Expansion",
      description: "Extended services across Southeast Europe",
    },
    {
      year: "2018",
      title: "500+ Projects",
      description: "Reached major milestone in project delivery",
    },
    {
      year: "2021",
      title: "MEP Specialization",
      description: "Expanded expertise in integrated MEP systems",
    },
    {
      year: "2026",
      title: "Industry Leader",
      description: "Recognized as leading BIM consultancy in the region",
    },
  ];

  const expertise = [
    {
      icon: Layers,
      title: "BIM Expertise",
      description:
        "Advanced knowledge in Building Information Modeling methodologies and coordination",
    },
    {
      icon: Users,
      title: "Multidisciplinary Team",
      description: "Engineers and architects working in seamless collaboration",
    },
    {
      icon: Award,
      title: "Quality Standards",
      description:
        "Commitment to precision and compliance with international standards",
    },
    {
      icon: CheckCircle,
      title: "Proven Track Record",
      description:
        "500+ successfully delivered projects across various sectors",
    },
  ];

  const values = [
    {
      title: "Precision",
      description:
        "Meticulous attention to detail in every aspect of design and coordination",
    },
    {
      title: "Coordination",
      description:
        "Seamless integration of all building disciplines for clash-free execution",
    },
    {
      title: "Innovation",
      description:
        "Leveraging latest BIM technologies and methodologies for optimal results",
    },
    {
      title: "Reliability",
      description:
        "Consistent delivery of high-quality technical documentation on schedule",
    },
  ];

  return (
    <div className="overflow-x-hidden">
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#00AEEF]/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00FF9C]/10 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              About{" "}
              <span className="bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] bg-clip-text text-transparent">
                NAVITECS
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              A multidisciplinary engineering and architecture consulting firm
              based in Sarajevo, specializing in BIM coordination and technical
              design solutions.
            </p>
          </motion.div>
        </div>
      </section>

      <section>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Who We Are
              </h2>
              <p className="text-gray-400 text-lg mb-6">
                NAVITECS d.o.o. is a BIM-focused engineering and architecture
                consulting company based in Sarajevo. Our team of experienced
                engineers and architects delivers comprehensive solutions for
                building design, coordination, and technical systems.
              </p>
              <p className="text-gray-400 text-lg mb-6">
                We specialize in multidisciplinary coordination, working closely
                with structural engineers, MEP specialists, and architects to
                ensure seamless project execution from concept to construction.
              </p>
              <p className="text-gray-400 text-lg">
                With over 15 years of experience and 500+ completed projects, we
                have established ourselves as a trusted partner for complex
                building developments across residential, commercial, and
                infrastructure sectors.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1641060272821-df59e2c0b5ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmFsJTIwb2ZmaWNlJTIwd29ya3NwYWNlfGVufDF8fHx8MTc3NTQ1ODU1OHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="NAVITECS office"
                  className="w-full h-[500px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-2xl border border-white/10 p-8 shadow-lg overflow-hidden bg-black/20 hover:bg-black/85 duration-300 ease-in-out"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00AEEF]/20 to-transparent" />
              <div className="relative z-10">
                <div className="inline-block p-4 bg-gradient-to-br from-[#00AEEF]/20 to-[#00FF9C]/20 rounded-xl mb-6">
                  <Target className="text-[#00AEEF]" size={32} />
                </div>
                <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
                <p className="text-gray-400 text-lg">
                  To deliver precision-engineered BIM solutions that solve
                  complex coordination challenges in building development. We
                  ensure seamless collaboration between all disciplines,
                  reducing conflicts and optimizing construction processes.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="relative rounded-2xl border border-white/10 p-8 shadow-lg overflow-hidden bg-black/20 hover:bg-black/85 duration-300 ease-in-out"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#00FF9C]/20 to-transparent" />
              <div className="relative z-10">
                <div className="inline-block p-4 bg-gradient-to-br from-[#00AEEF]/20 to-[#00FF9C]/20 rounded-xl mb-6">
                  <Eye className="text-[#00FF9C]" size={32} />
                </div>
                <h3 className="text-3xl font-bold mb-4">Our Approach</h3>
                <p className="text-gray-400 text-lg">
                  We combine technical expertise with advanced BIM methodologies
                  to deliver coordinated, construction-ready documentation. Our
                  multidisciplinary approach ensures all building systems work
                  together efficiently and comply with all relevant standards.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] bg-clip-text text-transparent">
                Journey
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Key milestones in our development as a leading BIM consultancy
            </p>
          </motion.div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-[#00AEEF] to-[#00FF9C] hidden lg:block" />

            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-8 ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}
                >
                  <div
                    className={`flex-1 ${index % 2 === 0 ? "lg:text-right" : "lg:text-left"}`}
                  >
                    <div className="bg-white/10 border border-white/10 rounded-xl p-6 hover:bg-black/60 hover:border-white/30 duration-300 ease-in-out">
                      <div className="text-2xl font-bold bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] bg-clip-text text-transparent mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-400 hover:black">
                        {milestone.description}
                      </p>
                    </div>
                  </div>

                  <div className="hidden lg:flex w-12 h-12 bg-gradient-to-br from-[#00AEEF] to-[#00FF9C] rounded-full items-center justify-center flex-shrink-0 relative z-10">
                    <div className="w-6 h-6 bg-black rounded-full" />
                  </div>

                  <div className="flex-1 hidden lg:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Our{" "}
              <span className="bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] bg-clip-text text-transparent">
                Expertise
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              What sets us apart in BIM consulting and engineering
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {expertise.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white/10 border border-white/15 rounded-xl p-6 hover:bg-black/85 hover:border-white/30 duration-400 ease-in-out shadow-lg"
              >
                <div className="inline-block p-3 bg-gradient-to-br from-[#00AEEF]/20 to-[#00FF9C]/20 rounded-xl mb-4">
                  <item.icon className="text-white" size={28} />
                </div>
                <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Core{" "}
              <span className="bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] bg-clip-text text-transparent">
                Values
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              The principles guiding our work and client relationships
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-white/10 border border-white/15 rounded-xl p-6 hover:bg-black/85 hover:border-white/30 duration-400 ease-in-out transition-all text-center"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#00AEEF]/20 to-[#00FF9C]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-gradient-to-br from-[#00AEEF] to-[#00FF9C] rounded-full" />
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-400 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
