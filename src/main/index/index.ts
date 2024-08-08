import Lib from "common/lib";
import Mongo from "database/mongodb.database";
import App from "core/App";

let db: Mongo | null = null;

export const main: DoFunction = async (args) => {
	try {
		const start = performance.now();

		if (!db) {
			db = await Mongo.Connection();
			Lib.Log("Connected to MongoDB");
		}

		const { user, instructions } = await App.Request(args);
		const end = performance.now();
		const time = Lib.msToString(end - start);
		return App.Response({
			message: "Hello world",
			runtime: time,
		});
	} catch (e) {
		return App.Error(400, e);
	}
};
