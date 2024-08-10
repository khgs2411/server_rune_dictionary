import { Actions } from "common/enums";
import type { Request } from "common/types";
import type { AspectCreationData, AspectRetrieveData } from "core/aspect/aspect.types";
import { main } from "main/index";
const api_key = "r_d_25c9dd62-ba12-44de-b303-67ef659ba7bd";

const insert_one_data: AspectCreationData = {
	tier: 1,
	weight: 0.3,
	potency: 0,
	rune_ids: [],
	required_rune_ids: [],
	blocked_aspect_ids: [],
};

const insert_one: Request = {
	api_key,
	action: Actions.ASPECT_INSERT_ASPECT,
	data: <AspectCreationData>insert_one_data,
};

const get_aspects_data: AspectRetrieveData[] = [
	{
		aspect_id: 0,
	},
];

const get_aspects: Request = {
	api_key,
	action: Actions.ASPECT_GET_ASPECTS,
	data: <AspectRetrieveData[]>get_aspects_data,
};

const insert_many_data: AspectCreationData[] = [
	{
		tier: 1,
		weight: 0.3,
		potency: 0,
		rune_ids: [],
		required_rune_ids: [],
		blocked_aspect_ids: [],
	},
	{
		tier: 1,
		weight: 0.3,
		potency: 0,
		rune_ids: [],
		required_rune_ids: [],
		blocked_aspect_ids: [],
	},
];

const insert_many: Request = {
	api_key,
	action: Actions.ASPECT_INSERT_ASPECTS,
	data: <AspectCreationData[]>insert_many_data,
};

const createOne = async () => await main(insert_one);

const getAspects = async () => await main(get_aspects);

const createMany = async () => await main(insert_many);

// const updateOne = async () => await main(update_one);

// const updateMany = async () => await main(update_many);

// const deleteOne = async () => await main(delete_one);

// const deleteMany = async () => await main(delete_many);

async function runAsepcts() {
	// const res = await createOne();
	const res = await createMany();
	// const res = await updateOne();
	// const res = await updateMany();
	// const res = await deleteOne();
	// const res = await deleteMany();
	// const res = await getAspects();
	console.log(JSON.stringify(res, null, 2));
}

const run = async () => {
	await runAsepcts();
	process.exit(0);
};

const invoke = async (payload: any) => {
	// const response = await main(args);
	const response = await fetch(
		"https://faas-ams3-2a2df116.doserverless.co/api/v1/web/fn-8b5106d1-8570-4f63-a2af-01748ac110f3/main/index",
		{
			method: "POST",
			body: JSON.stringify(payload),
			headers: {
				"Content-Type": "application/json",
			},
		},
	);
	const output = await response.json();
	console.log(output);
	process.exit(0);
};

await run();
