'use client';
import { signOut } from 'next-auth/react';
import styles from './user.module.css';

export default function LogoutBtn() {
	return (
		<button
			className={styles.btn}
			onClick={(e) => {
				signOut();
			}}
		>
			로그아웃
		</button>
	);
}
