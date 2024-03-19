import { MongoClient } from 'mongodb';

export default async function mongoconnection() {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	await client.connect();

	return client;
}
