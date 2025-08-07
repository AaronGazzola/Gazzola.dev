//-| File path: next.config.js
const { PrismaPlugin } = require('@prisma/nextjs-monorepo-workaround-plugin')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client', 'prisma']
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push('_http_common')
      config.plugins = [...config.plugins, new PrismaPlugin()]
    }
    return config
  }
};

module.exports = nextConfig;
