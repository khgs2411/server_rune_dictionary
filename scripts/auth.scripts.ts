import { Actions } from "common/enums";
import type { Request } from "common/types";
import { main } from "main/index/index";
const api_key = "r_d_25c9dd62-ba12-44de-b303-67ef659ba7bd";

const request: Request = {
	"api_key": "Aa123123",
	"action": Actions.AUTH_LOGIN,
	"data": {
		"api_key": "Aa123123",
		"username": "tal"
	}
};
export const run = async () => {
	return await main(request);
};

await run();