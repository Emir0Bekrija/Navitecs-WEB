"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    projectType: "",
    message: "",
  });

  const cardClass =
    "rounded-2xl border border-white/30 bg-black/70 p-6 transition-all duration-300 hover:bg-black hover:border-[#00AEEF]";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({
        name: "",
        email: "",
        company: "",
        phone: "",
        projectType: "",
        message: "",
      });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      content: "info@navitecs.ba",
      link: "mailto:info@navitecs.ba",
    },
    {
      icon: MapPin,
      title: "Office",
      content: "Sarajevo, Bosnia and Herzegovina",
      link: "#",
    },
  ];

  return (
    <div className="overflow-x-hidden">
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
              Get in{" "}
              <span className="bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] bg-clip-text text-transparent">
                Touch
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto">
              Contact us to discuss your BIM coordination and engineering needs
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 -mt-12 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => (
              <motion.a
                key={info.title}
                href={info.link}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`${cardClass} group`}
              >
                <div className="inline-block p-3 bg-gradient-to-br from-[#00AEEF]/20 to-[#00FF9C]/20 rounded-xl mb-4 group-hover:scale-110 transition-transform">
                  <info.icon className="text-white" size={24} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{info.title}</h3>
                <p className="text-gray-400">{info.content}</p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      <section className="relative bg-white/5 py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-4">Start a Conversation</h2>
              <p className="text-gray-400 mb-8">
                Fill out the form below and we'll respond within 24 hours
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
                  <h3 className="text-2xl font-bold mb-2">Message Sent</h3>
                  <p className="text-gray-400">
                    Thank you for contacting us. We'll get back to you soon.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium mb-2"
                      >
                        Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black/70 hover:bg-black border border-white/30 rounded-lg focus:outline-none focus:border-[#00AEEF] transition-colors text-white"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-2"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black/70 hover:bg-black border border-white/30 rounded-lg focus:outline-none focus:border-[#00AEEF] transition-colors text-white"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="company"
                        className="block text-sm font-medium mb-2"
                      >
                        Company
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black/70 hover:bg-black border border-white/30 rounded-lg focus:outline-none focus:border-[#00AEEF] transition-colors text-white"
                        placeholder="Company name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium mb-2"
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-black/70 hover:bg-black border border-white/30 rounded-lg focus:outline-none focus:border-[#00AEEF] transition-colors text-white"
                        placeholder="+387 XX XXX XXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="projectType"
                      className="block text-sm font-medium mb-2"
                    >
                      Project Type
                    </label>
                    <select
                      id="projectType"
                      name="projectType"
                      value={formData.projectType}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-black/70 hover:bg-black border border-white/30 rounded-lg focus:outline-none focus:border-[#00AEEF] transition-colors text-white"
                    >
                      <option value="" className="bg-[#111] text-white">
                        Select project type
                      </option>
                      <option
                        value="residential"
                        className="bg-[#111] text-white"
                      >
                        Residential
                      </option>
                      <option
                        value="commercial"
                        className="bg-[#111] text-white"
                      >
                        Commercial
                      </option>
                      <option
                        value="infrastructure"
                        className="bg-[#111] text-white"
                      >
                        Infrastructure
                      </option>
                      <option
                        value="bim-consulting"
                        className="bg-[#111] text-white"
                      >
                        BIM Consulting
                      </option>
                      <option
                        value="mep-design"
                        className="bg-[#111] text-white"
                      >
                        MEP Design
                      </option>
                      <option value="other" className="bg-[#111] text-white">
                        Other
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium mb-2"
                    >
                      Project Details *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="w-full px-4 py-3 bg-black/70 hover:bg-black border border-white/30 rounded-lg focus:outline-none focus:border-[#00AEEF] transition-colors text-white resize-none"
                      placeholder="Tell us about your project requirements..."
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full px-6 py-4 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black font-semibold rounded-lg hover:scale-105 transition-transform flex items-center justify-center space-x-2"
                  >
                    <span>Send Message</span>
                    <Send size={20} />
                  </button>
                </form>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-2xl font-bold mb-6">Office Location</h3>
                <div className={cardClass}>
                  <h4 className="font-semibold text-lg mb-4">
                    NAVITECS d.o.o.
                  </h4>
                  <div className="space-y-3 text-white">
                    <div className="flex items-start space-x-3">
                      <MapPin
                        className="text-[#00AEEF] flex-shrink-0 mt-1"
                        size={20}
                      />
                      <div>
                        <p>Sarajevo</p>
                        <p>Bosnia and Herzegovina</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Mail
                        className="text-[#00AEEF] flex-shrink-0 mt-1"
                        size={20}
                      />
                      <p>info@navitecs.ba</p>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Phone
                        className="text-[#00AEEF] flex-shrink-0 mt-1"
                        size={20}
                      />
                      <p>+387 33 XXX XXX</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className={`relative overflow-hidden h-80 ${cardClass}`}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="text-[#00AEEF] mx-auto mb-4" size={48} />
                    <p className="text-gray-400 font-semibold">
                      Sarajevo, Bosnia and Herzegovina
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Office location map
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6">Business Hours</h3>
                <div className={`${cardClass} space-y-3`}>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Monday - Friday</span>
                    <span className="font-medium">08:00 - 16:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Saturday - Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-black/70 hover:bg-black">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`${cardClass} text-center`}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Start Your{" "}
              <span className="bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] bg-clip-text text-transparent">
                Project?
              </span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Whether you need BIM coordination, structural engineering, MEP
              design, or complete project development services, our team is
              ready to help. Contact us today to discuss your requirements.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
