import * as auth from "./auth.scripts";

export const run = async () => {
	try {
		const res = await auth.run();
		// const res = await runes.run();
		// const res = await mongo.run();
		console.log(res);
	} catch (e) {
		console.error(e);
	} finally {
		process.exit(0);
	}
};

await run();
