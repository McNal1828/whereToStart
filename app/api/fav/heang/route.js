import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import { MongoClient } from 'mongodb';

/**
 * GET 요청이 들어오면 mongodb에서 session.user.email 과 동일한 email을 가지고 있는 document를 return 한다
 * @param {NextRequest} req
 * @param {URLSearchParams} param1
 * @returns document를 {data} 로 return한다.
 */
export async function GET(req, { params }) {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	await client.connect();
	const db = client.db('sang');
	const session = await getServerSession(authOptions);
	const data = await db.collection('data').findOne({ email: session.user.email });
	await client.close();
	return NextResponse.json({ data: data.favheang }, { status: 200 });
}

/**
 * PUT 요청이 들어오면 mongodb에서 session.user.email 과 동일한 email을 가지고 있는 document의 favheang Array에 req.body로 넘어온 newheang을 추가한다.
 * @param {NextRequest} req
 * @param {URLSearchParams} param1
 * @returns
 */
export async function PUT(req, { params }) {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	await client.connect();
	const db = client.db('sang');
	const session = await getServerSession(authOptions);
	const data = await req.json();
	const newheang = data.newheang;
	const check = await db.collection('data').findOne({ email: session.user.email, 'favheang.code': newheang.code });
	if (check) {
		await client.close();
		return NextResponse.json({ message: '요청성공' }, { status: 200 });
	} else {
		try {
			await db.collection('data').updateOne({ email: session.user.email }, { $push: { favheang: newheang } });
			await client.close();
			return NextResponse.json({ message: '요청성공' }, { status: 200 });
		} catch (error) {
			console.log(error);
			await client.close();
			return NextResponse.json({ message: '요청실패' }, { status: 500 });
		}
	}
}

/**
 * DELETE 요청이 들어오면 mongodb에서 session.user.email 과 동일한 email을 가지고 있는 document의 favheang Array에 req.body로 넘어온 oldheang을 제거한다.
 * @param {NextRequest} req
 * @param {URLSearchParams} param1
 * @returns
 */
export async function DELETE(req, { params }) {
	const uri = process.env.MONGODB_URI;
	const client = new MongoClient(uri);
	await client.connect();

	const db = client.db('sang');
	const session = await getServerSession(authOptions);
	const data = await req.json();
	const oldheang = data.oldheang;
	try {
		await db.collection('data').updateOne({ email: session.user.email }, { $pull: { favheang: { code: { $eq: oldheang.code } } } });
		await client.close();
		return NextResponse.json({ message: '요청성공' }, { status: 200 });
	} catch (error) {
		console.log(error);
		await client.close();
		return NextResponse.json({ message: '요청실패' }, { status: 500 });
	}
}
