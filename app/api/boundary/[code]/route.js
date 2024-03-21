import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '../../auth/[...nextauth]/route';
import mongoconnection from '../../fav/mongo';
/**
 *
 * @param {NextRequest} req
 * @param {URLSearchParams} param1
 * @returns
 */
export async function GET(req, { params }) {
	const code = params.code;
	// console.log(code);
	const client = await mongoconnection();
	const db = client.db('sang');
	const checkExisting = await db.collection('heangboundary').findOne({ 'properties.ab_cd': code });
	// console.log(checkExisting.geometry.coordinates);
	await client.close();
	if (checkExisting) {
		return NextResponse.json({ data: checkExisting.geometry.coordinates }, { status: 200 });
	} else {
		return NextResponse.json({ data: [] }, { status: 400 });
	}
}
