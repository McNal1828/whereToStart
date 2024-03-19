'use client';
import { useAppDispatch, useAppSelector, useAppStore } from '@/lib/hooks';
import { setlat, setlng, setzoom } from '@/lib/geo_reducer';
import styles from './search.module.css';
import { useEffect, useState } from 'react';

export default function Search() {
	const { searchq } = useAppSelector((state) => state.search);
	const dispatch = useAppDispatch();
	const [hits, sethits] = useState([]);
	return (
		<>
			<div className={styles.search}>
				<div className={styles.input}>
					<input
						type='search'
						placeholder={'동을 입력해 주세요'}
						value={searchq}
						onChange={(e) => {
							dispatch({ type: 'search/change', change: e.target.value });
							searchmeili(e, sethits);
						}}
					></input>
					<svg xmlns='http://www.w3.org/2000/svg' height='1em' viewBox='0 0 512 512'>
						<path d='M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z' />
					</svg>
				</div>
				{hits.map((hit) => (
					<div
						className={styles.hit}
						key={hit.adm_cd2}
						onClick={(e) => {
							dispatch(setlat(hit.lat));
							dispatch(setlng(hit.lng));
							dispatch(setzoom(15));
						}}
					>
						{hit.dong}
					</div>
				))}
			</div>
		</>
	);
}

/**
 *
 * @param {InputEvent} e
 * @param {Function} setresult
 */
function searchmeili(e, setresult) {
	if (e.target.value.length != 0) {
		fetch('/api/meili/search', {
			method: 'POST',
			body: JSON.stringify({
				q: e.target.value,
				index: 'dong',
			}),
		})
			.then((res) => res.json())
			.then((data) => setresult(data));
	} else {
		setresult([]);
	}
}
