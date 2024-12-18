import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Permitir builds aunque existan errores de TypeScript
    ignoreBuildErrors: true,
  },
  eslint: {
    // Permitir builds aunque existan errores de ESLint
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
