import type { MetadataRoute } from 'next';
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Carol Alves Moda & Acessórios', short_name: 'Carol Alves', start_url: '/', display: 'standalone',
    background_color: '#2E1419', theme_color: '#2E1419',
    icons: [{ src: '/icon-192.png', sizes: '192x192', type: 'image/png' }, { src: '/icon-512.png', sizes: '512x512', type: 'image/png' }],
  };
}
