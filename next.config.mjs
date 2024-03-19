/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: false,
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
};
export default nextConfig;
