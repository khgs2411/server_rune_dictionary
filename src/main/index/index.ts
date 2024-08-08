import Lib from "common/lib";
import Mongo from "database/mongodb.database";

let cachedDb: Mongo | null = null;

export const main: DoFunction = async (args) => {
	const start = performance.now();
	// if (!cachedDb) {
	// 	cachedDb = await Mongo.Connection();
	// }
	// const db = cachedDb;
	console.log(process.env.MONGO_USERNAME);
	console.log(process.env.MONGO_PASSWORD);
	console.log(process.env.MONGO_HOST);
	const end = performance.now();
	const time = Lib.msToString(end - start);
	return {
		body: "Rune Dictionary",
		runtime: time,
	};
};
