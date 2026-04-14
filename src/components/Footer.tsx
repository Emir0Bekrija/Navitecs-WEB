import Link from "next/link";
import Image from "next/image";
import { Linkedin } from "lucide-react";
import logo from "./LOGO.png";

export default function Footer() {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Services", path: "/services" },
    { name: "Projects", path: "/projects" },
    { name: "Careers", path: "/careers" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="relative bg-black/50 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-[#00AEEF] to-[#00FF9C] blur-lg opacity-30" />
              <Image
                src={logo}
                alt="NAVITECS Logo"
                className="relative z-10 h-10 w-auto object-contain"
                priority={false}
              />
            </div>

            <p className="text-gray-400 mb-6 max-w-md">
              BIM-focused engineering and architecture consulting company.
              Delivering precision coordination and technical solutions for
              building development.
            </p>

            <div className="flex space-x-4">
              <a
                href="#"
                className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors group"
                aria-label="LinkedIn"
              >
                <Linkedin
                  size={20}
                  className="text-gray-400 group-hover:text-[#00AEEF] transition-colors"
                />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

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
            <a href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
