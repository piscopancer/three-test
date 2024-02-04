/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.module.rules.push(
      {
        test: /\.(frag|vert|glsl)$/,
        type: 'asset/source',
      },
      {
        test: /\.(glb)$/,
        type: 'asset/resource',
      }
    )
    return config
  },
}

export default nextConfig
