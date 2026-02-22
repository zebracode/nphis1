import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  basePath: process.env.BASEPATH,
  redirects: async () => {
    return [
      {
        source: '/',
        destination: '/farms',
        permanent: true,
        locale: false
      }
    ]
  }
}

export default nextConfig
