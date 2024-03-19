import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../auth/[...nextauth]/route';
import { MongoClient } from 'mongodb';
import mongoconnection from './mongo';

const session = await getServerSession(authOptions);
/**
 * @type {MongoClient}
 */
const client = await mongoconnection();
const db = client.db('sang');

/**
 * GET 요청이 들어오면 mongodb에서 session.user.email 과 동일한 email을 가지고 있는 document를 return 한다
 * @param {NextRequest} req
 * @param {URLSearchParams} param1
 * @returns document를 {data} 로 return한다.
 */
export async function GET(req, { params }) {
	const data = await db.collection('data').findOne({ email: session.user.email }).favheang;
	return NextResponse.json({ data }, { status: 200 });
}

/**
 * PUT 요청이 들어오면 mongodb에서 session.user.email 과 동일한 email을 가지고 있는 document의 favheang Array에 req.body로 넘어온 newheang을 추가한다.
 * @param {NextRequest} req
 * @param {URLSearchParams} param1
 * @returns
 */
export async function PUT(req, { params }) {
	const data = await req.json();
	const newheang = data.newheang;
	try {
		await db.collection('data').updateOne(
			{ email: session.user.email }, // 조건
			{ $push: { favheang: newheang } } // 새 이메일 추가
		);
		return NextResponse.json({ message: '요청성공' }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: '요청실패' }, { status: 500 });
	}
}

/**
 * DELETE 요청이 들어오면 mongodb에서 session.user.email 과 동일한 email을 가지고 있는 document의 favheang Array에 req.body로 넘어온 oldheang을 제거한다.
 * @param {NextRequest} req
 * @param {URLSearchParams} param1
 * @returns
 */
export async function DELETE(req, { params }) {
	const data = await req.json();
	const oldheang = data.oldheang;
	try {
		await db.collection('data').updateOne(
			{ email: session.user.email }, // 조건
			{ $push: { favsang: oldheang } } // 기존 이메일 삭제
		);
		return NextResponse.json({ message: '요청실패' }, { status: 200 });
	} catch (error) {
		console.log(error);
		return NextResponse.json({ message: '요청실패' }, { status: 500 });
	}
}
