/** @type {import('next').NextConfig} */
const nextConfig = {
	experimental: {},
	images: {
		remotePatterns: [
			{
				hostname: 'cdn.discordapp.com',
				pathname: '/**',
				port: '',
				protocol: 'https',
			},
		],
	},
	env: { NEXTAUTH_URL: 'https://fingersnap.link' },
};
export default nextConfig;
