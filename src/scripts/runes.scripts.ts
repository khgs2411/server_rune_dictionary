import { Actions, BOOLEANISH } from "common/enums";
import Lib from "common/lib";
import { type Request } from "common/types";
import { RUNES } from "core/rune/rune.enums";
import type { RuneCreationData, RuneUpdateData } from "core/rune/rune.types";
import { main } from "main/index";

const api_key = "r_d_25c9dd62-ba12-44de-b303-67ef659ba7bd";

const insert_one: Request = {
	api_key,
	action: Actions.RUNE_INSERT_RUNE,
	data: <RuneCreationData>{
		name: RUNES.PHYSICAL.toString(),
		weight: 1.0,
	},
};

const insert_many: Request = {
	api_key,
	action: Actions.RUNE_INSERT_RUNES,
	data: <RuneCreationData[]>[
		{ name: RUNES.PHYSICAL.toString(), weight: 1.0 },
		{ name: RUNES.MAGICAL.toString(), weight: 1.0 },
		{ name: RUNES.MELEE.toString(), weight: 1.0 },
	],
};

const update_one: Request<RuneUpdateData> = {
	api_key,
	action: Actions.RUNE_UPDATE_RUNE,
	data: {
		rune_id: 2,
		weight: 0.3,
		type: BOOLEANISH.FALSE,
	},
};

const update_many: Request<RuneUpdateData[]> = {
	api_key,
	action: Actions.RUNE_UPDATE_RUNES,
	data: [
		{
			name: RUNES.PHYSICAL,
			weight: 1,
			type: BOOLEANISH.FALSE,
		},
		{
			name: RUNES.MAGICAL,
			weight: 1,
			type: BOOLEANISH.FALSE,
		},
		{
			rune_id: 2,
			weight: 0.5,
			type: BOOLEANISH.FALSE,
		},
	],
};

const delete_one: Request = {
	api_key,
	action: Actions.RUNE_DELETE_RUNE,
	data: <RuneCreationData>{
		name: RUNES.PHYSICAL,
	},
};

const delete_many: Request = {
	api_key,
	action: Actions.RUNE_DELETE_RUNES,
	data: <RuneCreationData[]>[{ name: RUNES.PHYSICAL }, { name: RUNES.MAGICAL }, { name: RUNES.MELEE }],
};

const get_runes: Request = {
	api_key,
	action: Actions.RUNE_GET_RUNES,
	data: [],
	// data: <RuneRetrieveData[]>[{ name: RUNES.PHYSICAL }, { rune_id: 1 }],
};

async function getRunes() {
	const res = await main(get_runes);
	Lib.LogObject(res);
}

async function createOne() {
	const res = await main(insert_one);
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

const run = async () => {
	try {
		await getRunes();
	} catch (e) {
		console.error(e);
	} finally {
		process.exit(0);
	}
};

const invoke = async () => {
	// const response = await main(args);
	try {
		const response = await fetch(
			"https://faas-ams3-2a2df116.doserverless.co/api/v1/web/fn-8b5106d1-8570-4f63-a2af-01748ac110f3/main/create",
			{
				method: "POST",
				body: JSON.stringify(insert_many),
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

await run();
// await invoke();
