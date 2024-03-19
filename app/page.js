import Map from './map';
import Search from './search';
import StoreProvider from './StoreProvider';
import User from './user';

export default function Home() {
	return (
		<>
			<StoreProvider>
				<Map />
				<Search />
				<User />
			</StoreProvider>
		</>
	);
}
