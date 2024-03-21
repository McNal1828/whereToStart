import { NextRequest, NextResponse } from 'next/server';
import connection from '../../connect';

export async function GET(req, { params }) {
	const [conn, cache] = connection();
	const cacheKey = `ab_summary_view:${params.id}`;

	// Redis에서 먼저 데이터를 찾습니다.
	const redisRow = await cache.get(cacheKey);

	if (!redisRow) {
		// Redis에 데이터가 없다면 MySQL에서 데이터를 가져옵니다.
		const [rows, fields] = await conn.execute(`SELECT * from ab_summary_view WHERE cd_cd = ${params.id}`);

		// 결과를 Redis에 저장합니다.
		await cache.set(cacheKey, JSON.stringify(rows, null, ' '),'EX', 1000);
	} else {
		// Redis에서 가져온 데이터는 문자열이므로 다시 객체로 변환합니다.
		rows = JSON.parse(rows);
	}
	return NextResponse.json({ rows }, { status: 200 });
}
