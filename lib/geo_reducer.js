import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	lng: 127.0501,
	lat: 37.653,
	zoom: 17,
};

export const geoSlice = createSlice({
	name: 'geo',
	initialState,
	reducers: {
		setlng(state, action) {
			state.lng = action.payload;
		},
		setlat(state, action) {
			state.lat = action.payload;
		},
		setzoom(state, action) {
			state.zoom = action.payload;
		},
	},
});

export const { setlng, setlat, setzoom } = geoSlice.actions;
export default geoSlice;
