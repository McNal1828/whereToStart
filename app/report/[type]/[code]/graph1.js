'use client';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { Bar, Line, Pie } from 'react-chartjs-2';
import styles from './graph1.module.css';
import Chart from 'chart.js/auto';

export default function Graph1() {
	const params = useParams();
	const fetcher = (...args) => fetch(...args, {}).then((res) => res.json());
	const { data, error, isLoading } = useSWR(`/api/mysql/${params.type}/${params.code}`, fetcher);
	if (error) {
		return (
			<>
				<div className={styles.container}>
					<p>에러발생 :(</p>
				</div>
			</>
		);
	}
	if (isLoading) {
		return (
			<>
				<div className={styles.container}>
					<p>로딩중...</p>
				</div>
			</>
		);
	}
	const s2023 = data.rows.filter((obj) => obj.year == 2023);
	const maxsang = s2023.reduce((max, obj) => (obj.cd_total_sa > max.cd_total_sa ? obj : max));
	console.log(maxsang);
	const sangs = data.rows.map((obj) => obj.cd_nm);
	const uniquesangs = [...new Set(sangs)];
	const datasets = [];
	for (let sang of uniquesangs) {
		const sang1_data = data.rows.filter((obj) => obj.cd_nm === sang);
		const sang1_data_sas = sang1_data.map((obj) => Number(obj.cd_total_sa));
		datasets.push({
			label: sang,
			data: sang1_data_sas,
		});
	}
	const options = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top',
			},
			title: {
				display: false,
				text: '소속 상권 총 매출 변화 추이',
			},
		},
	};

	const labels = [2019, 2020, 2021, 2022, 2023];

	const data_ = {
		labels,
		datasets,
	};
	return (
		<>
			<div className={styles.container}>
				<p>소속 상권 총 매출 변화 추이</p>
				{params.type == 'sang' ? <Bar options={options} data={data_} /> : <Line options={options} data={data_} />}
				<p>2023 제일 잘나가는 상권 / 업종</p>
				<div className={styles.imbest}>
					<p>{maxsang.cd_nm}</p>
					<div>
						<p>{maxsang.st_nm}</p>
						<p>(매출 비율 : {Number(maxsang.ratio).toFixed(2)}%)</p>
					</div>
				</div>
			</div>
		</>
	);
}

function Piii(data) {}
