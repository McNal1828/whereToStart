import { NextRequest, NextResponse } from 'next/server';
import connection from '../../connect';

import { NextRequest, NextResponse } from 'next/server';
import connection from '../../connect';

export async function GET(req, { params }) {
	const [conn, cache] = connection();
	const cacheKey = `ab_summary_view:${params.id}`;

	// Redis에서 먼저 데이터를 찾습니다.
	await redisClient.get(cacheKey, async (err, value) => {
		if(value) {
			return  NextResponse.json({value} , { status: 200 }); 
		}
		else {
			await redisClient.set(key, values, 'EX', 600);
			const [rows, fields] = await conn.execute(`SELECT * from ab_summary_view WHERE cd_cd = ${params.id}`);
			return NextResponse.json({ rows }, { status: 200 });
		}
	});

	return NextResponse.json({ rows }, { status: 200 });
}