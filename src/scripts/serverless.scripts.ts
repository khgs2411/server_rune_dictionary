import { Actions } from "common/enums";
import { RUNES } from "core/rune/rune.enums";
import type { RuneCreationData, RuneUpdateData } from "core/rune/rune.types";
import { main } from "main/index";
import { type Request } from "common/types";
const api_key = "r_d_25c9dd62-ba12-44de-b303-67ef659ba7bd";
const insert_many: Request = {
	api_key,
	action: Actions.RUNE_INSERT_RUNES,
	data: <RuneCreationData[]>[
		{ name: RUNES.PHYSICAL.toString(), weight: 1.0 },
		{ name: RUNES.MAGICAL.toString(), weight: 1.0 },
		{ name: RUNES.MELEE.toString(), weight: 1.0 },
	],
};

const update_one: Request = {
	api_key,
	action: Actions.RUNE_UPDATE_RUNE,
	data: <RuneUpdateData>{
		name: RUNES.MELEE,
		weight: 0.5,
		type: "default",
	},
};

const update_many: Request = {
	api_key,
	action: Actions.RUNE_UPDATE_RUNES,
	data: <RuneUpdateData[]>[
		{
			name: RUNES.PHYSICAL,
			weight: 0.5,
			type: "default",
		},
		{
			name: RUNES.MAGICAL,
			weight: 0.5,
			type: "default",
		},
		{
			name: RUNES.MELEE,
			weight: 0.5,
			type: "default",
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
	data: <RuneCreationData[]>[{ rune_id: 0 }, { name: RUNES.MAGICAL }, { name: RUNES.MELEE }],
};

async function createMany() {
	const res = await main(insert_many);
	console.log(res);
}

async function updateOne() {
	const res = await main(update_one);
	console.log(res);
}

async function updateMany() {
	const res = await main(update_many);
	console.log(res);
}

async function deleteOne() {
	const res = await main(delete_one);
	console.log(res);
}

async function deleteMany() {
	const res = await main(delete_many);
	console.log(res);
}

const run = async () => {
	await createMany();
	// await updateOne();
	await updateMany();
	// await deleteOne();
	// await deleteMany();
	process.exit(0);
};

const invoke = async () => {
	// const response = await main(args);
	const response = await fetch(
		"https://faas-ams3-2a2df116.doserverless.co/api/v1/web/fn-8b5106d1-8570-4f63-a2af-01748ac110f3/main/index",
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
	process.exit(0);
};

await run();
// await invoke();
