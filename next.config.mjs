/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "yruvlpfyrjjbzwhguknp.supabase.co",
      },
    ],
  },
};

export default nextConfig;
