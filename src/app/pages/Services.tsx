import { motion } from "motion/react";
import { Link } from "react-router";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import {
  Layers,
  Building2,
  Ruler,
  GitMerge,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useState } from "react";

export default function Services() {
  const services = [
    {
      icon: Layers,
      title: "BIM Consulting",
      description: "Comprehensive BIM coordination services to ensure seamless collaboration between all project stakeholders.",
      image: "https://www.uniquescadd.com/wp-content/uploads/2025/09/BIM-Consulting-Services.png",
      hoverImage: "https://gandyandroberts.com.au/wp-content/uploads/2019/04/Hedberg-BIM.png",
      features: [
        "Multidisciplinary Coordination",
        "Clash Detection & Resolution",
        "BIM Workflow Optimization",
        "Model Quality Assurance",
        "4D/5D BIM Integration",
        "Standards & Protocols Development",
      ],
      capabilities: [
        "Coordination between architects, structural engineers, and MEP teams",
        "Early identification of design conflicts through advanced clash detection",
        "Implementation of efficient BIM workflows tailored to project needs",
        "Ensuring model accuracy and compliance with industry standards",
      ],
    },
    {
      icon: Building2,
      title: "Project Development",
      description: "Full lifecycle project support from initial concept through construction documentation and delivery.",
      image: "https://images.unsplash.com/photo-1626385785701-a0d3b879de2c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBzaXRlJTIwYnVpbGRpbmclMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NzU0NTg1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      hoverImage: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
      features: [
        "Conceptual Design Support",
        "Technical Documentation",
        "Construction-Ready Models",
        "Quantity Takeoffs",
        "Construction Sequencing",
        "As-Built Documentation",
      ],
      capabilities: [
        "Comprehensive project planning and development oversight",
        "Detailed technical drawings and specifications",
        "Coordinated 3D models ready for construction",
        "Accurate material quantities for cost estimation",
      ],
    },
    {
      icon: Ruler,
      title: "Architectural & Structural Design",
      description: "Functional and compliant design solutions for residential and commercial buildings.",
      image: "https://images.unsplash.com/photo-1681216868987-b7268753b81c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBhcmNoaXRlY3R1cmUlMjBidWlsZGluZyUyMGRlc2lnbnxlbnwxfHx8fDE3NzU0NTg1NTZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      hoverImage: "https://blog.novatr.com/hs-fs/hubfs/Using%20Revit%20for%20structural%20design.png?width=1000&height=562&name=Using%20Revit%20for%20structural%20design.png",
      features: [
        "Architectural Design",
        "Structural Engineering",
        "Building Code Compliance",
        "Space Planning",
        "Facade Design",
        "Structural Analysis",
      ],
      capabilities: [
        "Innovative architectural solutions balancing aesthetics and functionality",
        "Structural systems designed for safety and efficiency",
        "Full compliance with local building codes and regulations",
        "Optimized space utilization and circulation planning",
      ],
    },
    {
      icon: GitMerge,
      title: "MEP Design",
      description: "Integrated mechanical, electrical, and plumbing system planning focused on efficiency and safety.",
      image: "https://www.hok.com/wp-content/uploads/2023/01/bp-high-performance-mep-1900.jpg",
      hoverImage: "https://miro.medium.com/1*i3XmmDqNRVD5U5gB88yuzw.jpeg",
      features: [
        "HVAC System Design",
        "Electrical Distribution",
        "Plumbing Systems",
        "Fire Protection",
        "Energy Efficiency Analysis",
        "System Integration",
      ],
      capabilities: [
        "Comprehensive mechanical systems for optimal climate control",
        "Efficient electrical design meeting all safety requirements",
        "Integrated plumbing solutions for water supply and drainage",
        "Coordinated MEP systems that work seamlessly together",
      ],
    },
  ];

  const process = [
    {
      number: "01",
      title: "Initial Consultation",
      description: "Understanding project requirements, scope, and technical constraints.",
    },
    {
      number: "02",
      title: "Analysis & Planning",
      description: "Detailed assessment and development of comprehensive project strategy.",
    },
    {
      number: "03",
      title: "BIM Coordination",
      description: "Creating coordinated 3D models and identifying potential conflicts.",
    },
    {
      number: "04",
      title: "Design Development",
      description: "Detailed design of all systems with technical documentation.",
    },
    {
      number: "05",
      title: "Quality Review",
      description: "Rigorous checking for compliance and constructability.",
    },
    {
      number: "06",
      title: "Delivery & Support",
      description: "Final documentation and ongoing construction phase support.",
    },
  ];

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-96 h-96 bg-[#00AEEF]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#00FF9C]/10 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:64px_64px]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] bg-clip-text text-transparent">
                Services
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Comprehensive BIM consulting and engineering solutions for building projects of all scales
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="space-y-32">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <div className="inline-block p-3 bg-gradient-to-br from-[#00AEEF]/20 to-[#00FF9C]/20 rounded-xl mb-6">
                    <service.icon className="text-white" size={32} />
                  </div>
                  <h2 className="text-4xl font-bold mb-4">{service.title}</h2>
                  <p className="text-gray-400 text-lg mb-8">{service.description}</p>

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Key Services</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {service.features.map((feature) => (
                        <div key={feature} className="flex items-start space-x-2">
                          <CheckCircle className="text-[#00FF9C] flex-shrink-0 mt-0.5" size={18} />
                          <span className="text-gray-400 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mb-8">
                    <h3 className="text-xl font-semibold mb-4">Capabilities</h3>
                    <ul className="space-y-2">
                      {service.capabilities.map((capability, idx) => (
                        <li key={idx} className="text-gray-400 text-sm flex items-start">
                          <span className="text-[#00AEEF] mr-2">•</span>
                          {capability}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    to="/contact"
                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black font-semibold rounded-lg hover:scale-105 transition-transform"
                  >
                    Request Consultation
                    <ArrowRight className="ml-2" size={20} />
                  </Link>
                </div>

                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div
                    className="relative rounded-2xl overflow-hidden border border-white/10 w-full h-[500px]"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <ImageWithFallback
                      src={service.image}
                      alt={service.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <ImageWithFallback
                      src={service.hoverImage}
                      alt={`${service.title} Blueprint`}
                      className="absolute inset-0 w-full h-full object-cover z-10"
                      style={{
                        clipPath: hoveredIndex === index
                          ? "inset(0 0% 0 0)"
                          : index % 2 === 0
                            ? "inset(0 0 0 100%)"   // even: slides in from right
                            : "inset(0 100% 0 0)",  // odd: slides in from left
                        opacity: hoveredIndex === index ? 1 : 0.7,
                        transition: "clip-path 700ms ease-in-out, opacity 700ms ease-in-out",
                      }}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
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
                Process
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              A systematic approach ensuring precision and quality at every stage
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {process.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative bg-black border border-white/10 rounded-2xl p-6 hover:border-[#00AEEF]/50 transition-all group"
              >
                <div className="text-5xl font-bold bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] bg-clip-text text-transparent mb-4 opacity-30 group-hover:opacity-50 transition-opacity">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Let's Discuss Your{" "}
              <span className="bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] bg-clip-text text-transparent">
                Project
              </span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
              Contact us to learn how our BIM and engineering expertise can optimize your building development process.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black font-semibold rounded-lg hover:scale-105 transition-transform"
            >
              Get in Touch
              <ArrowRight className="ml-2" size={20} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
