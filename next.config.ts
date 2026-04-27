import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Prevent Node.js-only packages from being bundled for the browser.
  // mariadb and its dependencies use Node.js built-ins (net, tls, crypto, etc.)
  // and must never appear in the client bundle.
  serverExternalPackages: [
    "mariadb",
    "@prisma/adapter-mariadb",
    "@prisma/client",
    "bcryptjs",
    "geoip-lite",
  ],
};

export default nextConfig;
