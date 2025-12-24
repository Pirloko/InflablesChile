/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Habilitar WebXR y características necesarias
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'camera=*, xr-spatial-tracking=*',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;


