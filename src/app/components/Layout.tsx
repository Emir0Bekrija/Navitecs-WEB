import { Outlet, Link, useLocation } from "react-router";
import { motion } from "motion/react";
import { Menu, X, Twitter, Linkedin, Github, Instagram } from "lucide-react";
import { useState, useEffect } from "react";
import logo from "./LOGO.png";
import { CustomCursor } from "./CustomCursor";

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <CustomCursor />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
                <img src={logo} alt="NAVITECS Logo" className="relative z-10 h-10 w-50 object-contain" />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className="relative px-4 py-2 text-lg font-medium transition-colors group"
                >
                  <span className={`relative z-10 ${isActive(link.path) ? "text-white" : "text-gray-400 group-hover:text-white"}`}>
                    {link.name}
                  </span>
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-white/10 rounded-lg"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* CTA Button */}
            <div className="hidden md:block">
              <Link
                to="/contact"
                className="relative px-6 py-2.5 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black font-semibold rounded-lg overflow-hidden group"
              >
                <span className="relative z-10">Get Started</span>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-black"
          >
            <div className="px-6 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-colors ${
                    isActive(link.path)
                      ? "bg-white/10 text-white"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full px-4 py-3 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] text-black font-semibold rounded-lg text-center"
              >
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 mt-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] blur-lg opacity-30"></div>
                <img src={logo} alt="NAVITECS Logo" className="relative z-10 h-10 w-auto object-contain" />
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                BIM-focused engineering and architecture consulting company. Delivering precision coordination and technical solutions for building development.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group">
                  <Linkedin size={20} className="text-gray-400 group-hover:text-[#00AEEF] transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-400">
                <li>info@navitecs.ba</li>
                <li>+387 33 XXX XXX</li>
                <li>Sarajevo, Bosnia and Herzegovina</li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2026 NAVITECS. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}