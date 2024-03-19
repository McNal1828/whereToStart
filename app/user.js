import styles from './user.module.css';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { MongoClient } from 'mongodb';
import LoginBtn from './loginbtn';
import LogoutBtn from './logoutbtn';
import Image from 'next/image';
import Userdata from './userdata';

export default async function User() {
	const uri = process.env.MONGODB_URI;
	const client = await MongoClient.connect(uri);
	const db = client.db();
	const session = await getServerSession(authOptions);
	return (
		<>
			<div className={styles.user}>
				<div className={styles.login}>
					{session ? (
						<>
							<Image src={session.user.image} width={45} height={45} alt='디스코드이미지' className={styles.icon}></Image>
							<LogoutBtn />
						</>
					) : (
						<>
							<div></div>
							<LoginBtn />
						</>
					)}
				</div>
				<Userdata />
			</div>
		</>
	);
}
