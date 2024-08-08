import Lib from "common/lib";
import { main } from "main/index";
const run = async () => {
	const args: DoFunctionArgs = {
		http: {
			path: "",
			method: "POST",
			headers: {
				accept: "",
				"accept-encoding": "",
				"content-type": "",
				host: "",
				"user-agent": "",
				"x-forwarded-for": "",
				"x-forwarded-proto": "",
				"x-request-id": "",
			},
		},
	};

	const response = await main(args);
	console.log(response);
	process.exit(0);
};

await run();
