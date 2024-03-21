import mysql from 'mysql2/promise';
import redis from 'redis';
import { promisify } from 'util';

export default async function connection() {
	const connection = await mysql.createConnection({
		host: process.env.MYSQL_HOST,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PW,
		database: process.env.MYSQL_DB,
	});
	const cache = redis.createClient({
		host : "aurora-redis-ro.z6wkin.ng.0001.apne1.cache.amazonaws.com", 
		port : 6379
	});

	cache.get = promisify(cache.get);
    cache.set = promisify(cache.set);

	return [connection, cache];
}