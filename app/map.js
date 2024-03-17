'use client';
import maplibregl from 'maplibre-gl';
import { useEffect, useRef, useState } from 'react';
import styles from './map.module.css';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setlat, setlng, setzoom } from '@/lib/geo_reducer';

export default function Map() {
	const mapContainer = useRef(null);
	const map = useRef(null);
	const [apiKey] = useState(process.env.NEXT_PUBLIC_API_KEY);
	const { lng, lat, zoom } = useAppSelector((state) => state.geo);
	const dispatch = useAppDispatch();

	const mapName = process.env.NEXT_PUBLIC_MAP_NAME;
	const region = process.env.NEXT_PUBLIC_REGION;
	const heang_boundary = require('/public/heang.json');
	const heang_point = require('/public/heangpoint.json');
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
			map.current.addImage('custom-marker', image.data);
			map.current.addSource('heang_boundary', { type: 'geojson', data: heang_boundary });
			map.current.addSource('heang_point', { type: 'geojson', data: heang_point });
			map.current.addLayer({
				id: 'heang_boundary_fill',
				type: 'fill',
				source: 'heang_boundary',
				paint: {
					'fill-color': '#d3d2d2',
					'fill-opacity': 0.7,
					'fill-outline-color': '#000000',
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
			map.current.on('moveend', () => {
				const { lat: newlat, lng: newlng } = map.current.getCenter();
				dispatch(setlat(newlat.toFixed(6)));
				dispatch(setlng(newlng.toFixed(6)));
			});
			map.current.on('zoomend', () => {
				const newzoom = map.current.getZoom();
				dispatch(setzoom(newzoom));
			});
			map.current.on('click', 'heang_point_icon', (e) => {
				new maplibregl.Popup().setLngLat(e.features[0].geometry.coordinates).setHTML(`<h1>${e.features[0].properties.adm_nm}</h1>`).addTo(map.current);
				map.current.flyTo({
					center: e.features[0].geometry.coordinates,
					zoom: 15,
					speed: 1.5,
					easing(t) {
						return t;
					},
				});
			});
			map.current.on('mouseenter', 'heang_point_icon', () => {
				map.current.getCanvas().style.cursor = 'pointer';
			});
			map.current.on('mouseleave', 'heang_point_icon', () => {
				map.current.getCanvas().style.cursor = '';
			});
		});
	}, []);

	useEffect(() => {
		map.current.flyTo({
			center: [lng, lat],
			zoom: zoom,
			speed: 1.5,
			easing(t) {
				return t;
			},
		});
	}, [lng, lat]);

	return (
		<>
			<div ref={mapContainer} className={styles.mapWrap}></div>
		</>
	);
}
