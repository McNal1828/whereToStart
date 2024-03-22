import { NextRequest, NextResponse } from 'next/server';
import connection from '../../connect';

export async function GET(req, { params }) {
	const conn = connection();
	const [rows, fields] = await (await conn).execute(`SELECT * from ab_summary_view WHERE ab_cd = ${params.id}`);
	return NextResponse.json({ rows }, { status: 200 });
}
