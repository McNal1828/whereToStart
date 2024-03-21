import mysql from 'mysql2/promise';
import redis from 'redis';

export default async function connection() {
	const connection = await mysql.createConnection({
		host: process.env.MYSQL_HOST,
		user: process.env.MYSQL_USER,
		password: process.env.MYSQL_PW,
		database: process.env.MYSQL_DB,
	});
	console.log('MySQL connected.');

	try {
	const cache = redis.createClient({
		host : "aurora-redis.z6wkin.ng.0001.apne1.cache.amazonaws.com",
		port : 6379,
	});
	cache.on('error', err => console.log('Redis Client Error', err));
	console.log('Redis connected.');
	} catch (error) {
		console.error('Error connecting to Redis:', error);
	}
	connection.connect();
	return [connection, cache];
}