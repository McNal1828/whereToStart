'use client';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import { Bar, Line, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

export default function Graph1() {
	const params = useParams();
	const fetcher = (...args) => fetch(...args, {}).then((res) => res.json());
	const { data, error, isLoading } = useSWR(`/api/mysql/${params.type}/${params.code}`, fetcher);
	if (error) {
		return <p>에러발생</p>;
	}
	if (isLoading) {
		return <p>로딩중.....</p>;
	}

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
				display: true,
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
			<p>왔어</p>
			{params.type == 'sang' ? <Bar options={options} data={data_} /> : <Line options={options} data={data_} />}
			<p>2023 제일 잘나가는 업종</p>
		</>
	);
}

function Piii(data) {}
