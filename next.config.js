/** @type {import('next').NextConfig} */
const runtimeCaching = require("next-pwa/cache");
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === 'development',
  skipWaiting: true,
  runtimeCaching,
  buildExcludes: [/middleware-manifest.json$/],
});

const nextConfig = withPWA({
  reactStrictMode: true,
  env: {
    adw_url: process.env.ADW_URL,
    adw_url_test: process.env.ADW_URL_TEST,
    adw_secret_key: process.env.ADW_SECRET_KEY,
  }
})

module.exports = nextConfig
