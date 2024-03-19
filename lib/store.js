import { combineReducers, configureStore } from '@reduxjs/toolkit';

import searchSlice from './search_reducer';
import geoSlice from './geo_reducer';

const rootReducer = combineReducers({
	search: searchSlice.reducer,
	geo: geoSlice.reducer,
});

export const makeStore = () => {
	return configureStore({
		reducer: rootReducer,
	});
};
