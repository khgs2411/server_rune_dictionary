import Lib from "common/lib";
import Mongo from "database/mongodb.database";
import App from "services/app.service";

let cachedDb: Mongo | null = null;

export const main: DoFunction = async (args) => {
	try {
		const start = performance.now();

		if (!cachedDb) {
			cachedDb = await Mongo.Connection();
			Lib.Log("Connected to MongoDB");
		}

		const db = cachedDb;
		await App.Request(args);
		const end = performance.now();
		const time = Lib.msToString(end - start);
		return App.Response({
			message: "Hello world",
			runtime: time,
			args: args,
		});
	} catch (e) {
		return App.Error(500, e);
	}
};
