/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.VONK_ENV == 'build' ? 'build/.next' : '.next',
};

module.exports = nextConfig;
