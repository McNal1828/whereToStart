import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
	title: '새싹 프로젝트 3조',
	description: 'Amazon Location Service와 공공 데이터를 활용한 상권 분석',
};

export default function RootLayout({ children }) {
	return (
		<html lang='en'>
			<head>
				<link href='https://unpkg.com/maplibre-gl@3.x/dist/maplibre-gl.css' rel='stylesheet' />
				{/* <script src='https://unpkg.com/maplibre-gl@4.1.1/dist/maplibre-gl.js'></script> */}
			</head>
			<body className={inter.className}>{children}</body>
		</html>
	);
}
