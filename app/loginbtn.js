'use client';
import { signIn } from 'next-auth/react';
import styles from './user.module.css';

export default function LoginBtn() {
	return (
		<button
			className={styles.btn}
			onClick={(e) => {
				signIn('discord', { callbackUrl: 'https://fingersnap.link/api/fav' });
			}}
		>
			로그인
		</button>
	);
}
