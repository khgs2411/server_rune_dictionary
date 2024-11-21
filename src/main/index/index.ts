import Lib from "common/lib";
import App from "App";
import Mongo from "database/mongodb.database";

let db: Mongo | null = null;

export const main: DoFunction = async (request) => {
	try {
		const start = performance.now();

		if (!db) db = await Mongo.Connection().finally(() => Lib.Log("Connected to MongoDB"));

		const response = await App.Process(await App.Request(request));

		const end = performance.now();

		return App.Response({
			...response,
			runtime: Lib.msToString(end - start),
		});
	} catch (e) {
		return App.Error(400, e);
	}
};
