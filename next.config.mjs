/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ui-avatars.com', // Permitimos este dominio
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // Permitimos placeholders por si acaso
        port: '',
        pathname: '/**',
      },
       // Si usas Supabase Storage en el futuro, agregarás su dominio aquí también
    ],
  },
};

export default nextConfig;
