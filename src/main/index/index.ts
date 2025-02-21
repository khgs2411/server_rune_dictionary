import Lib from "common/lib";
import App from "App";
import Mongo from "database/connections/mongodb.database";
import { Logger } from "application/utils/logger";

let db: Mongo | null = null;

export const main: DoFunction = async (request) => {
	
	if (request.__ow_method === "options" || request.method === "OPTIONS") return App.Preflight(request);

	try {
		const start = performance.now();

		Logger.GetInstance().debug("Request received:", request.body);

		if (!db) db = await Mongo.Connection();

		const response = await App.Process(await App.Request(request));

		const end = performance.now();

		return App.Response(
			{
				...response,
				runtime: Lib.msToString(end - start),
			},
			request,
		);
	} catch (e) {
		return App.Error(400, e, request);
	}
};
