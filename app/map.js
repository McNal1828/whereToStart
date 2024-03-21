'use client';
import maplibregl from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import styles from './map.module.css';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setlat, setlng, setzoom } from '@/lib/geo_reducer';
import { setchanged, setheang, setsang, setwhich } from '@/lib/fav_reducer';

export default function Map() {
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [apiKey] = useState(process.env.NEXT_PUBLIC_API_KEY);
	const { lng, lat, zoom } = useAppSelector((state) => state.geo);
	const { curheang, cursang } = useAppSelector((state) => state.cur);
	const { heang, sang } = useAppSelector((state) => state.ufav);
	const [cboundary, setcboundary] = useState([]);
	const dispatch = useAppDispatch();
	const [selectdata, setselectdata] = useState({});

	const mapName = process.env.NEXT_PUBLIC_MAP_NAME;
	const region = process.env.NEXT_PUBLIC_REGION;
	const heang_boundary = require('/public/heang.json');
	const heang_point = require('/public/heangpoint.json');
	const sang_point = require('/public/sangpoint.json');
	const boundary = [
		[126.759751, 37.428234],
		[127.190599, 37.703801],
	];

	useEffect(() => {
		if (map.current) return;
		map.current = new maplibregl.Map({
			container: mapContainer.current,
			style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
			center: [lng, lat],
			zoom: zoom,
			attributionControl: false,
			maxBounds: boundary,
		});

		map.current.addControl(new maplibregl.NavigationControl(), 'bottom-left');

		map.current.on('load', async () => {
			const image = await map.current.loadImage('https://maplibre.org/maplibre-gl-js/docs/assets/custom_marker.png');
			map.current.addImage('custom-marker', image.data, {});
			map.current.addImage('custom-marker2', image.data, {
				sdf: 'true',
			});
			map.current.addSource('heang_boundary', { type: 'geojson', data: heang_boundary });
			map.current.addSource('heang_point', { type: 'geojson', data: heang_point });
			map.current.addSource('sang_point', { type: 'geojson', data: sang_point });
			map.current.addSource('highlight', { type: 'geojson', data: {} });
			map.current.addLayer({
				id: 'heang_boundary_fill',
				type: 'fill',
				source: 'heang_boundary',
				paint: {
					'fill-color': '#95BEFA',
					'fill-opacity': 0.2,
					'fill-outline-color': '#000000',
				},
				filter: ['==', '$type', 'Polygon'],
			});
			map.current.addLayer({
				id: 'highlight_fill',
				type: 'fill',
				source: 'highlight',
				paint: {
					'fill-color': '#FFFB00',
					'fill-opacity': 0.3,
					'fill-outline-color': '#74FF00',
				},
				filter: ['==', '$type', 'Polygon'],
			});
			map.current.addLayer({
				id: 'heang_point_icon',
				type: 'symbol',
				source: 'heang_point',
				filter: ['==', '$type', 'Point'],
				layout: {
					'icon-image': 'custom-marker',
				},
			});
			map.current.addLayer({
				id: 'sang_point_icon',
				type: 'symbol',
				source: 'sang_point',
				filter: ['==', '$type', 'Point'],
				minzoom: 14,
				layout: {
					'icon-image': 'custom-marker2',
					'icon-size': 0.7,
				},
				paint: {
					'icon-color': '#958EFA',
				},
			});

			// map.current.on('moveend', () => {
			// 	const { lat: newlat, lng: newlng } = map.current.getCenter();
			// 	dispatch(setlat(newlat.toFixed(6)));
			// 	dispatch(setlng(newlng.toFixed(6)));
			// });
			// map.current.on('zoomend', () => {
			// 	const newzoom = map.current.getZoom();
			// 	dispatch(setzoom(newzoom));
			// });
			map.current.on('click', 'heang_point_icon', (e) => {
				dispatch(setlng(e.features[0].geometry.coordinates[0]));
				dispatch(setlat(e.features[0].geometry.coordinates[1]));
				dispatch(setzoom(15));
				dispatch({
					type: 'cur/setcurheang',
					code: e.features[0].properties.ab_cd,
					name: e.features[0].properties.adm_nm,
					sum_cm_sa: e.features[0].properties.sum_cm_sa,
					sum_total_ns: e.features[0].properties.sum_total_ns,
					ratio_cm_sa_ns: e.features[0].properties.ratio_cm_sa_ns,
					max_total_ns_st_nm: e.features[0].properties.max_total_ns_st_nm,
					max_cm_sa_st_nm: e.features[0].properties.max_cm_sa_st_nm,
				});
				dispatch({
					type: 'cur/setcursang',
					code: 0,
					name: '',
					sum_cm_sa: 0,
					sum_total_ns: 0,
					ratio_cm_sa_ns: 0,
					max_total_ns_st_nm: '',
					max_cm_sa_st_nm: '',
				});
			});
			map.current.on('mouseenter', 'heang_point_icon', () => {
				map.current.getCanvas().style.cursor = 'pointer';
			});
			map.current.on('mouseleave', 'heang_point_icon', () => {
				map.current.getCanvas().style.cursor = '';
			});
			map.current.on('click', 'sang_point_icon', (e) => {
				dispatch(setlng(e.features[0].geometry.coordinates[0]));
				dispatch(setlat(e.features[0].geometry.coordinates[1]));
				dispatch(setzoom(16));
				dispatch({
					type: 'cur/setcurheang',
					code: e.features[0].properties.ab_cd,
					name: e.features[0].properties.ab_nm,
					sum_cm_sa: e.features[0].properties.sum_cm_sa,
					sum_total_ns: e.features[0].properties.sum_total_ns,
					ratio_cm_sa_ns: e.features[0].properties.ratio_cm_sa_ns,
					max_total_ns_st_nm: e.features[0].properties.max_total_ns_st_nm,
					max_cm_sa_st_nm: e.features[0].properties.max_cm_sa_st_nm,
				});
				dispatch({
					type: 'cur/setcursang',
					code: e.features[0].properties.cd_cd,
					name: e.features[0].properties.cd_nm,
					sum_cm_sa: e.features[0].properties.sum_cm_sa,
					sum_total_ns: e.features[0].properties.sum_total_ns,
					ratio_cm_sa_ns: e.features[0].properties.ratio_cm_sa_ns,
					max_total_ns_st_nm: e.features[0].properties.max_total_ns_st_nm,
					max_cm_sa_st_nm: e.features[0].properties.max_cm_sa_st_nm,
				});
			});
			map.current.on('mouseenter', 'sang_point_icon', () => {
				map.current.getCanvas().style.cursor = 'pointer';
			});
			map.current.on('mouseleave', 'sang_point_icon', () => {
				map.current.getCanvas().style.cursor = '';
			});
		});
	}, []);

	useEffect(() => {
		map.current.flyTo({
			center: [lng, Number(lat) + 0.001],
			zoom: zoom,
			speed: 1.5,
			easing(t) {
				return t;
			},
		});
	}, [lat, lng]);

	useEffect(() => {
		if (curheang.code != 0 || cursang.code != 0) {
			// cursang.code == 0 ? heangdata(curheang.code, setselectdata) : sangdata(cursang.code, setselectdata);

			const popups = document.getElementsByClassName('maplibregl-popup');

			if (popups.length) {
				popups[0].remove();
			}
			const pophtml = `
			<div class='pop'>
				<div class='name'>
					<label class='label'>${curheang.name}${cursang.code == 0 ? '' : ' / ' + cursang.name}</label>
					<div>
						<button id='move'>이동</button>
						<button id='favadd'>추가</button>
						<button id='favdel'>제거</button>
					</div>
				</div>
				<div class='items'>
					<div class='item'><div>${cursang.code == 0 ? curheang.sum_cm_sa : cursang.sum_cm_sa}원</div><label>분기 총 매출</label></div>
					<div class='item'><div>${cursang.code == 0 ? curheang.sum_total_ns : cursang.sum_total_ns}개</div><label>총 점포 수</label></div>
					<div class='item'><div>${
						cursang.code == 0 ? Number(curheang.ratio_cm_sa_ns).toFixed(0) : Number(cursang.ratio_cm_sa_ns).toFixed(0)
					}원</div><label>분기 평균 매출</label></div>
					<div class='item'><div>${cursang.code == 0 ? curheang.max_total_ns_st_nm : cursang.max_total_ns_st_nm}</div><label>최다 점포 업종</label></div>
					<div class='item'><div>${cursang.code == 0 ? curheang.max_cm_sa_st_nm : cursang.max_cm_sa_st_nm}</div><label>최고 매출 업종</label></div>
				</div>
			</div>
		`;
			new maplibregl.Popup().setLngLat([lng, lat]).setHTML(pophtml).addTo(map.current).setMaxWidth('100vw');

			document.getElementById('favadd').addEventListener('click', function () {
				fetch(`/api/fav/${cursang.code == 0 ? 'heang' : 'sang'}`, {
					method: 'PUT',
					body: JSON.stringify({
						newheang: { ...curheang, lat: lat, lng: lng },
						newsang: { ...cursang, lat: lat, lng: lng, heang_code: curheang.code, heang_name: curheang.name },
					}),
				})
					.then((res) => res.json())
					.then((data) => console.log(data));
				dispatch(setchanged(true));
				dispatch(setwhich(cursang.code == 0 ? 1 : 2));
			});
			document.getElementById('favdel').addEventListener('click', function () {
				fetch(`/api/fav/${cursang.code == 0 ? 'heang' : 'sang'}`, {
					method: 'DELETE',
					body: JSON.stringify({
						oldheang: curheang,
						oldsang: cursang,
					}),
				})
					.then((res) => res.json())
					.then((data) => console.log(data));
				dispatch(setchanged(true));
				dispatch(setwhich(cursang.code == 0 ? 1 : 2));
			});

			document.getElementById('move').addEventListener('click', function () {
				window.open(`/report/${cursang.code == 0 ? 'heang' : 'sang'}/${cursang.code == 0 ? curheang.code : cursang.code}`, '_blank');
			});
		}
		searchboundary(curheang.code, setcboundary);
	}, [curheang, cursang]);

	useEffect(() => {
		if (curheang.code != 0 || cursang.code != 0) {
			const highlight_geojson = {
				type: 'FeatureCollection',
				features: [
					{
						type: 'Feature',
						geometry: {
							type: 'MultiPolygon',
							coordinates: cboundary.data,
						},
					},
				],
			};
			map.current.getSource('highlight').setData(highlight_geojson);
		}
	}, [cboundary]);

	return (
		<>
			<div ref={mapContainer} className={styles.mapWrap}></div>
			{/* <div>
				<div>{curheang.code}</div>
				<div>{curheang.name}</div>
				<div>{cursang.code}</div>
				<div>{cursang.name}</div>
			</div> */}
		</>
	);
}

/**
 *
 * @param {number} code
 * @param {Function} setcboundary
 */
function searchboundary(code, setcboundary) {
	if (code != 0) {
		fetch(`/api/boundary/${code}`, {
			method: 'GET',
		})
			.then((res) => res.json())
			.then((data) => setcboundary(data));
	}
}
