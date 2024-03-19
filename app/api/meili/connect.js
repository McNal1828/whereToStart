import MeiliSearch from 'meilisearch';
export default function connect() {
	const meiliClient = new MeiliSearch({
		host: process.env.MEILI_HOST,
		apiKey: process.env.MEILI_API,
	});
	return meiliClient;
}
