import Guards from "common/guards";
import type Aspect from "core/aspect/aspect";
import type { AspectCreationData, AspectRetrieveData, AspectUpdateData } from "core/aspect/aspect.types";
import Mongo from "database/mongodb.database";
import { AspectModel } from "models/aspects.model";
import type mongoose from "mongoose";
import type { Document } from "mongoose";

export type AspectDocument = Document<
	unknown,
	{},
	{
		hash: string;
		tier: number;
		weight: number;
		potency: number;
		rune_ids: number[];
		required_rune_ids: number[];
		blocked_aspect_ids: number[];
		is_damage: number;
		is_typed: number;
		is_dot: number;
		is_range: number;
		hit_count: number;
		wait_turns: number;
		percent: number;
		convert: number;
		aspect_id?: number | null | undefined;
	}
> & {
	hash: string;
	tier: number;
	weight: number;
	potency: number;
	rune_ids: number[];
	required_rune_ids: number[];
	blocked_aspect_ids: number[];
	is_damage: number;
	is_typed: number;
	is_dot: number;
	is_range: number;
	hit_count: number;
	wait_turns: number;
	percent: number;
	convert: number;
	aspect_id?: number | null | undefined;
} & { _id: mongoose.Types.ObjectId };
class AspectRepository {
	constructor() {}

	public static async Get(aspects: AspectRetrieveData[]) {
		await Mongo.Connection();

		const aspectIds = aspects.filter((aspect) => aspect.aspect_id !== undefined).map((aspect) => aspect.aspect_id);
		const hashes = aspects.filter((aspect) => aspect.hash).map((aspect) => aspect.hash);

		const filters = [];

		if (aspectIds.length > 0) {
			filters.push({ aspect_id: { $in: aspectIds } });
		}
		if (hashes.length > 0) {
			filters.push({ hash: { $in: hashes } });
		}

		const retrievedAspects = await AspectModel.find({ $or: filters }).exec();
		return retrievedAspects;
	}

	public static async Create(asepect: Aspect) {
		await Mongo.Connection();
		const already_exists = await AspectModel.findOne(asepect.serialize());

		if (!Guards.IsNil(already_exists)) throw "asepect already exists";

		const new_asepect = AspectModel.create(asepect.serialize());
		return new_asepect;
	}

	public static async CreateMany(aspects: Aspect[]) {
		await Mongo.Connection();

		//get all the hashes of the aspects
		const hashes = aspects.map((aspect) => aspect.getHashCode());

		//get all the aspects that already exist using the these hashes
		const existingAspects = await AspectModel.find({ hash: { $in: hashes } })
			.select("hash")
			.exec();

		//get the last aspect_id
		let lastAspectId = existingAspects.reduce((maxId, aspect) => Math.max(maxId, aspect.aspect_id ?? 0), 0);

		//filter hashes that already exist, and if they don't exist, increase the aspect_id
		const existingAspectHashes = new Set(existingAspects.map((aspect) => aspect.hash));
		const newAspects = aspects.filter((aspect) => !existingAspectHashes.has(aspect.getHashCode()));
		newAspects.forEach((aspect) => {
			aspect.aspect_id = ++lastAspectId;
		});

		//create the new aspects
		const newAspectsData = newAspects.map((aspect) => aspect.serialize()) as AspectCreationData[];
		const newAspectsCreated = await AspectModel.create(newAspectsData);
		return newAspectsCreated;
	}

	public static async Update(data: AspectUpdateData): Promise<AspectDocument>;
	public static async Update(_id: string, data?: AspectUpdateData): Promise<AspectDocument>;
	public static async Update(_idOrData: string | AspectUpdateData, data?: AspectUpdateData): Promise<AspectDocument> {
		await Mongo.Connection();
		let filter;
		let updateData;
		if (typeof _idOrData === "string") {
			if (!data) throw "Undefined|null data provided!";
			const { aspect_id, hash, ...rest } = data;
			filter = { _id: _idOrData };
			updateData = rest;
		} else {
			const { aspect_id, hash, ...rest } = _idOrData;
			filter = Guards.IsNil(aspect_id) ? { hash: hash } : { aspect_id: aspect_id };
			updateData = rest;
		}
		const updated = await AspectModel.findOneAndUpdate(filter, updateData, { new: false });
		if (!updated) throw "Aspect does not exist";
		return updated;
	}

	public static async UpdateMany(data: AspectUpdateData[]) {
		await Mongo.Connection();

		const bulkOperations = data.map((data) => {
			const update = Object.keys(data)
				.filter((key) => !Guards.IsNil(data[key]))
				.reduce((obj, key) => {
					(obj as any)[key] = data[key];
					return obj;
				}, {} as { [key: string]: any });

			return {
				updateOne: {
					filter: Guards.IsNil(data.aspect_id) ? { hash: data.hash } : { aspect_id: data.aspect_id },
					update: { $set: update },
				},
			};
		});

		const updated = await AspectModel.bulkWrite(bulkOperations);

		return updated;
	}

	public static async Delete(aspectData: AspectRetrieveData) {
		await Mongo.Connection();
		const filter = Guards.IsNil(aspectData.aspect_id) ? { hash: aspectData.hash } : { aspect_id: aspectData.aspect_id };
		return await AspectModel.deleteOne(filter);
	}

	public static async DeleteMany(data: AspectRetrieveData[]) {
		await Mongo.Connection();
		return await AspectModel.bulkWrite(
			data.map((aspect) => ({
				deleteOne: {
					filter: Guards.IsNil(aspect.aspect_id) ? { hash: aspect.hash } : { aspect_id: aspect.aspect_id },
				},
			})),
		);
	}
}

export default AspectRepository;
