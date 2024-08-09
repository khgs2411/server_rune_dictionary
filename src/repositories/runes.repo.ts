import Guards from "common/guards";
import type Rune from "core/rune/rune";
import type { RuneCreationData, RuneDeleteData, RuneUpdateData } from "core/rune/rune.types";
import Mongo from "database/mongodb.database";
import { RuneModel } from "models/runes.model";
import type { UpdateWriteOpResult } from "mongoose";

class RuneRepository {
	public static async Create(rune: Rune) {
		await Mongo.Connection();

		const already_exists = await RuneModel.findOne(rune.serialize());

		if (!Guards.IsNil(already_exists)) throw "Rune already exists";

		const new_rune = new RuneModel(rune.serialize());

		await new_rune.save();
		return new_rune;
	}

	public static async CreateMany(runes: Rune[]) {
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

	public static async Update(data: RuneUpdateData): Promise<UpdateWriteOpResult>;
	public static async Update(_id: string, data?: RuneUpdateData): Promise<UpdateWriteOpResult>;
	public static async Update(_idOrData: string | RuneUpdateData, data?: RuneUpdateData): Promise<UpdateWriteOpResult> {
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

	public static async UpdateMany(data: RuneUpdateData[]) {
		await Mongo.Connection();
		const existing_runes = await RuneModel.find({ name: { $in: data.map((rune) => rune.name) } });
		const updated = await RuneModel.bulkWrite(
			existing_runes.map((update) => ({
				updateOne: {
					filter: { name: update.name },
					update: update,
				},
			})),
		);

		return updated;
	}

	public static async Delete(data: RuneDeleteData) {
		await Mongo.Connection();

		const filter = Guards.IsNil(data.rune_id) ? { name: data.name } : { rune_id: data.rune_id };
		const deleted = await RuneModel.deleteOne(filter);
		return deleted;
	}

	public static async DeleteMany(data: RuneDeleteData[]) {
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
}
export default RuneRepository;
