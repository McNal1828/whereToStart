import NextAuth from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise, { client } from './mongo.js';

/**
 * @type {import('next-auth').AuthOptions}
 */
export const authOptions = {
	// Configure one or more authentication providers
	providers: [
		DiscordProvider({
			clientId: process.env.DISCORD_CLIENT_ID,
			clientSecret: process.env.DISCORD_CLIENT_SECRET,
		}),
		// ...add more providers here
	],
	adapter: MongoDBAdapter(clientPromise),
	session: {
		maxAge: 1 * 24 * 60 * 60,
		updateAge: 1 * 60 * 60,
	},
	callbacks: {
		// async signIn({ user, account, profile, email, credentials }) {
		// console.log(user);
		// console.log(account);
		// console.log(profile);
		// console.log(email);
		// console.log(credentials);
		// 	return true;
		// },
		// async redirect({ url, baseUrl }) {
		// console.log(url);
		// console.log(baseUrl);
		// 	return url;
		// },
		// async jwt({ token, user, account, profile, isNewUser }) {
		// console.log(token);
		// console.log(user);
		// console.log(account);
		// console.log(profile);
		// console.log(isNewUser);
		// 	return token;
		// },
		// async session({ session, token, user }) {
		// 	// console.log(session);
		// 	// console.log(token);
		// 	// console.log(user);
		// 	return session;
		// },
	},
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
