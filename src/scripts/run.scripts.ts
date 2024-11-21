import * as aspects from "./aspects.scripts"
import * as runes from "./runes.scripts"
import * as mongo from "./mognodb.scripts"
export const run = async () => {
	try {
		await aspects.run();
	} catch (e) {
		console.error(e);
	} finally {
		process.exit(0);
	}
};

await run();