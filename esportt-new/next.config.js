const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  // Removed output: 'export' to enable API routes
  // basePath: isProd ? '/Esportt' : '',
  // assetPrefix: isProd ? '/Esportt/' : '',
  reactStrictMode: true,
  swcMinify: true,
};
