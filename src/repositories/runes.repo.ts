import Guards from "common/guards";
import type Rune from "core/rune/rune";
import type { RuneCreationData, RuneDeleteData, RuneRetrieveData, RuneUpdateData } from "core/rune/rune.types";
import Mongo from "database/mongodb.database";
import { RuneModel } from "models/runes.model";
import type mongoose from "mongoose";
import type { UpdateWriteOpResult, Document } from "mongoose";

export type RuneDocument = Document<
	unknown,
	{},
	{ name: string; weight: number; type?: string | null | undefined; rune_id?: number | null | undefined }
> & { name: string; weight: number; type?: string | null | undefined; rune_id?: number | null | undefined } & {
	_id: mongoose.Types.ObjectId;
};

class RuneRepository {
	constructor() {}

	public static async Get(runes: RuneRetrieveData[]) {
		await Mongo.Connection();

		const runeIds = runes.filter((rune) => rune.rune_id !== undefined).map((rune) => rune.rune_id);
		const runeNames = runes.filter((rune) => rune.name).map((rune) => rune.name);

		const filters = [];

		if (runeIds.length > 0) {
			filters.push({ rune_id: { $in: runeIds } });
		}
		if (runeNames.length > 0) {
			filters.push({ name: { $in: runeNames } });
		}

		const retrievedRunes = await RuneModel.find({ $or: filters }).exec();
		return retrievedRunes;
	}

	public static async Create(rune: Rune) {
		await Mongo.Connection();

		const already_exists = await RuneModel.findOne(rune.serialize());

		if (!Guards.IsNil(already_exists)) throw "Rune already exists";

		const new_rune = RuneModel.create(rune.serialize());
		// const new_rune = new RuneModel(rune.serialize());
		// await new_rune.save();
		return new_rune;
	}

	/**@deprecated */
	public static async $CreateMany(runes: Rune[]) {
		await Mongo.Connection();

		const serializedRunes: RuneCreationData[] = runes.map((rune) => rune.serialize()) as RuneCreationData[];
		const runeNames = serializedRunes.map((rune) => rune.name);

		const existingRunes = await RuneModel.find({ name: { $in: runeNames } })
			.select("name")
			.exec();

		const existingRuneNames = new Set(existingRunes.map((rune) => rune.name));
		const uniqueRunes = serializedRunes.filter((rune) => !existingRuneNames.has(rune.name));

		if (uniqueRunes.length <= 0) throw "All runes already exist";

		const lastRune = await RuneModel.findOne().sort({ rune_id: -1 }).exec();

		let nextRuneId = lastRune ? (lastRune.rune_id as number) + 1 : 0;

		uniqueRunes.forEach((rune) => {
			rune.rune_id = nextRuneId++;
		});

		const newRunes = await RuneModel.insertMany(uniqueRunes);
		return newRunes;
	}

	public static async CreateMany(runes: Rune[]) {
		await Mongo.Connection();

		const serializedRunes = runes.map((rune) => rune.serialize()) as RuneCreationData[];
		const runeNames = serializedRunes.map((rune) => rune.name);

		const existingRunes = await RuneModel.find({ name: { $in: runeNames } })
			.select("name rune_id")
			.exec();

		const existingRuneNames = new Set(existingRunes.map((rune) => rune.name));
		const lastRuneId = existingRunes.reduce((maxId, rune) => Math.max(maxId, rune.rune_id ?? 0), 0);

		let nextRuneId = lastRuneId + 1;

		const uniqueRunes = serializedRunes.reduce<RuneCreationData[]>((acc, rune) => {
			if (!existingRuneNames.has(rune.name)) {
				rune.rune_id = nextRuneId++;
				acc.push(rune);
			}
			return acc;
		}, []);

		if (uniqueRunes.length === 0) throw "All runes already exist";

		const newRunes = await RuneModel.insertMany(uniqueRunes);
		return newRunes;
	}

	public static async $Update(data: RuneUpdateData): Promise<UpdateWriteOpResult>;
	public static async $Update(_id: string, data?: RuneUpdateData): Promise<UpdateWriteOpResult>;
	public static async $Update(_idOrData: string | RuneUpdateData, data?: RuneUpdateData): Promise<UpdateWriteOpResult> {
		await Mongo.Connection();

		if (typeof _idOrData == "string") {
			const _id = _idOrData;
			const exists = await RuneModel.findOne({ _id });

			if (Guards.IsNil(exists)) throw "Rune does not exist";

			const updated = await RuneModel.updateOne({ _id }, data);
			return updated;
		} else {
			const exists = await RuneModel.findOne({ name: _idOrData.name });

			if (Guards.IsNil(exists)) throw "Rune does not exist";

			const updated = await RuneModel.updateOne({ name: _idOrData.name }, _idOrData);
			return updated;
		}
	}

	public static async Update(data: RuneUpdateData): Promise<RuneDocument>;
	public static async Update(_id: string, data?: RuneUpdateData): Promise<RuneDocument>;
	public static async Update(_idOrData: string | RuneUpdateData, data?: RuneUpdateData): Promise<RuneDocument> {
		await Mongo.Connection();

		let filter;
		let updateData;

		if (typeof _idOrData === "string") {
			filter = { _id: _idOrData };
			updateData = data;
		} else {
			filter = { name: _idOrData.name };
			updateData = _idOrData;
		}

		const updated = await RuneModel.findOneAndUpdate(filter, updateData, { new: false });
		if (!updated) throw "Rune does not exist";
		return updated;
	}

	public static async $UpdateMany(data: RuneUpdateData[]) {
		await Mongo.Connection();

		// Create bulkWrite operations for updating each rune
		const bulkOperations = data.map((runeData) => {
			// Start with an empty update object
			const update: Partial<RuneUpdateData> = {};

			// Only include keys that are defined in runeData
			if (runeData.weight !== undefined) {
				update.weight = runeData.weight;
			}
			if (runeData.type !== undefined) {
				update.type = runeData.type;
			}

			return {
				updateOne: {
					filter: { name: runeData.name },
					update: { $set: update },
				},
			};
		});

		// Execute the bulkWrite operation
		const updated = await RuneModel.bulkWrite(bulkOperations);

		return updated;
	}

	public static async UpdateMany(data: RuneUpdateData[]) {
		await Mongo.Connection();

		const bulkOperations = data.map((runeData) => {
			const update = {
				...(runeData.weight !== undefined && { weight: runeData.weight }),
				...(runeData.type !== undefined && { type: runeData.type }),
			};

			return {
				updateOne: {
					filter: { name: runeData.name },
					update: { $set: update },
				},
			};
		});

		const updated = await RuneModel.bulkWrite(bulkOperations);

		return updated;
	}

	public static async $Delete(data: RuneDeleteData) {
		await Mongo.Connection();

		const filter = Guards.IsNil(data.rune_id) ? { name: data.name } : { rune_id: data.rune_id };
		const deleted = await RuneModel.deleteOne(filter);
		return deleted;
	}

	public static async Delete(data: RuneDeleteData) {
		await Mongo.Connection();

		const filter = Guards.IsNil(data.rune_id) ? { name: data.name } : { rune_id: data.rune_id };
		return await RuneModel.deleteOne(filter);
	}

	public static async $DeleteMany(data: RuneDeleteData[]) {
		await Mongo.Connection();
		const deleted = await RuneModel.bulkWrite(
			data.map((rune) => ({
				deleteOne: {
					filter: Guards.IsNil(rune.rune_id) ? { name: rune.name } : { rune_id: rune.rune_id },
				},
			})),
		);
		return deleted;
	}

	public static async DeleteMany(data: RuneDeleteData[]) {
		await Mongo.Connection();
		return await RuneModel.bulkWrite(
			data.map((rune) => ({
				deleteOne: {
					filter: Guards.IsNil(rune.rune_id) ? { name: rune.name } : { rune_id: rune.rune_id },
				},
			})),
		);
	}
}
export default RuneRepository;
