import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { MongoClient } from 'mongodb';
import mongoconnection from './mongo';
/**
 *
 * @param {NextRequest} req
 * @param {URLSearchParams} param1
 * @returns
 */
export async function GET(req, { params }) {
	const session = await getServerSession(authOptions);
	// console.log(session);
	// const uri = process.env.MONGODB_URI;
	// const client = new MongoClient(uri);
	// await client.connect();
	const client = await mongoconnection();
	const db = client.db('sang');
	const checkExisting = await db.collection('data').findOne({ email: session.user.email });
	if (!checkExisting) {
		console.log('not existing');
		await db.collection('data').insertOne({
			email: session.user.email,
			favsang: [],
			favheang: [],
		});
	} else {
		console.log('existing');
	}

	const url = new URL(req.url);
	const response = NextResponse.redirect(new URL('/', url));
	return response;
}
