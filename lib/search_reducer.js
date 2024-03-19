import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	searchq: '',
};

export const searchSlice = createSlice({
	name: 'search',
	initialState,
	reducers: {
		change(state, action) {
			state.searchq = action.change;
		},
	},
});

export const { change } = searchSlice.actions;
export default searchSlice;
