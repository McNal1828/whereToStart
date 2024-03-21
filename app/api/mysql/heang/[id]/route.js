import { NextRequest, NextResponse } from 'next/server';
import connection from '../../connect';

export async function GET(req, { params }) {
    const [conn, cache] = await connection();
    const cacheKey = `ab_summary_view:${params.id}`;

    // Redis에서 먼저 데이터를 찾습니다.
    let redisRow = await cache.get(cacheKey);

    if (!redisRow) {
        // Redis에 데이터가 없다면 MySQL에서 데이터를 가져옵니다.
        const [rows, fields] = await (await conn).execute(`SELECT * from ab_summary_view WHERE ab_cd = ${params.id}`);

        // 결과를 Redis에 저장합니다.
        await cache.set(cacheKey, JSON.stringify(rows, null, ' '));
    } else {
        // Redis에서 가져온 데이터는 문자열이므로 다시 객체로 변환합니다.
        rows = JSON.parse(rows);
    }

    return NextResponse.json({ rows }, { status: 200 });
}