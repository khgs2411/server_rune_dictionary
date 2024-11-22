import * as aspects from "./aspects.scripts";
import * as runes from "./runes.scripts";
import * as mongo from "./mognodb.scripts";
import * as auth from "./auth.scripts";

export const run = async () => {
	try {
		const res = await auth.run();
		console.log(res);
	} catch (e) {
		console.error(e);
	} finally {
		process.exit(0);
	}
};

await run();
