import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import connect from '../connect';

/**
 *
 * @param {NextRequest} req
 * @param {*} param1
 */
export async function POST(req, { params }) {
	const body = await req.json();
	const { q, index } = body;

	const result = (await connect().index(index).search(q)).hits;
	if (result.length >= 7) {
		return NextResponse.json(result.slice(0, 7));
	}
	return NextResponse.json(result);
}
