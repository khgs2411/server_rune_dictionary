import { Actions } from "common/enums";
import Lib from "common/lib";
import type { Request } from "common/types";
import type { AspectCreationData, AspectRetrieveData, AspectUpdateData } from "core/aspect/aspect.types";
import { main } from "main/index";

const api_key = "r_d_25c9dd62-ba12-44de-b303-67ef659ba7bd";

const insert_one_data: AspectCreationData = {
	tier: 1,
	weight: 0.3,
	potency: 0,
	rune_ids: [0],
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
	// data: <AspectRetrieveData[]>get_aspects_data,
	data: [],
};

const insert_many_data: AspectCreationData[] = [
	{
		tier: 1,
		weight: 0.3,
		potency: 0,
		rune_ids: [0],
		required_rune_ids: [],
		blocked_aspect_ids: [],
	},
	{
		tier: 1,
		weight: 0.3,
		potency: 10,
		rune_ids: [0],
		required_rune_ids: [],
		blocked_aspect_ids: [],
	},
];

const insert_many: Request = {
	api_key,
	action: Actions.ASPECT_INSERT_ASPECTS,
	data: <AspectCreationData[]>insert_many_data,
};

const udpate_one_data: AspectUpdateData = {
	aspect_id: 0,
	potency: 10,
};

const update_one: Request = {
	api_key,
	action: Actions.ASPECT_UPDATE_ASPECT,
	data: <AspectUpdateData>udpate_one_data,
};

const update_many_data: AspectUpdateData[] = [
	{
		aspect_id: 0,
		potency: 0,
	},
];
const update_many: Request = {
	api_key,
	action: Actions.ASPECT_UPDATE_ASPECTS,
	data: <AspectUpdateData[]>update_many_data,
};

const delete_one_data: AspectRetrieveData = {
	aspect_id: 0,
};

const delete_one: Request = {
	api_key,
	action: Actions.ASPECT_DELETE_ASPECT,
	data: <AspectRetrieveData>delete_one_data,
};

const delete_many_data: AspectRetrieveData[] = [
	{
		aspect_id: 0,
	},
	{
		aspect_id: 1,
	},
	{
		aspect_id: 2,
	},
];

const delete_many: Request = {
	api_key,
	action: Actions.ASPECT_DELETE_ASPECTS,
	data: <AspectRetrieveData[]>delete_many_data,
};

async function createOne() {
	const res = await main(insert_one);
	Lib.LogObject(res);
}

async function getAspects() {
	const res = await main(get_aspects);
	Lib.LogObject(res);
}

async function createMany() {
	const res = await main(insert_many);
	Lib.LogObject(res);
}

async function updateOne() {
	const res = await main(update_one);
	Lib.LogObject(res);
}

async function updateMany() {
	const res = await main(update_many);
	Lib.LogObject(res);
}

async function deleteOne() {
	const res = await main(delete_one);
	Lib.LogObject(res);
}

async function deleteMany() {
	const res = await main(delete_many);
	Lib.LogObject(res);
}

export const run = async () => {
	try {
		await getAspects();
	} catch (e) {
		console.error(e);
	} finally {
		process.exit(0);
	}
};
export const invoke = async (payload: any) => {
	try {
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
	} catch (e) {
		console.error(e);
	} finally {
		process.exit(0);
	}
};
