import { main } from "main/index";

const args: DoFunctionArgs = {
	api_key: "r_d_25c9dd62-ba12-44de-b303-67ef659ba7bd",
};

const invoke = async () => {
	// const response = await main(args);
	const response = await fetch(
		"https://faas-ams3-2a2df116.doserverless.co/api/v1/web/fn-8b5106d1-8570-4f63-a2af-01748ac110f3/main/index",
		{
			method: "POST",
			body: JSON.stringify(args),
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
	const output = await response.json();
	console.log(output);
	process.exit(0);
};

const run = async () => {
	const res = await main(args);
	console.log(res);
	process.exit(0);
};

await run();
// await invoke();
