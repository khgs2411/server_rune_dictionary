import Mongo from "database/mongodb.database";
import type { Request } from "common/types";
import { Actions } from "common/enums";
import { main } from "main/index";
const api_key = "r_d_25c9dd62-ba12-44de-b303-67ef659ba7bd";

const request: Request = {
	api_key: api_key,
	action: Actions.AUTH_LOGIN,
	data: {
		username: "admisn",
		api_key: api_key,
	},
};
export const run = async () => {
	await Mongo.Connection();
	return await main(request);
};
