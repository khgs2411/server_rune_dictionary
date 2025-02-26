import Guards from "common/guards";
import Lib from "common/lib";
import type Aspect from "application/domain/aspect/aspect";
import type {
	AspectCreationData,
	AspectDeleteData,
	AspectRetrieveData,
	AspectUpdateData,
	IAspectProperties,
} from "application/domain/aspect/aspect.types";
import Mongo from "database/connections/mongodb.database";
import { AspectModel } from "database/models/aspects.model";
import type mongoose from "mongoose";

export default class AspectRepository {
	
	public static async Get(aspects?: AspectRetrieveData[]) {
		await Mongo.Connection();

		if (Guards.IsNil(aspects) || Lib.IsEmpty(aspects)) return AspectModel.find().lean();

		const aspectIds = aspects.filter((aspect) => aspect.aspect_id !== undefined).map((aspect) => aspect.aspect_id);
		const hashes = aspects.filter((aspect) => aspect.hash).map((aspect) => aspect.hash);

		const filters = [];

		if (aspectIds.length > 0) filters.push({ aspect_id: { $in: aspectIds } });

		if (hashes.length > 0) filters.push({ hash: { $in: hashes } });

		return AspectModel.find({ $or: filters }).lean();
	}

	public static async Create(asepect: Aspect) {
		await Mongo.Connection();
		console.log(asepect.serialize());
		const already_exists = await AspectModel.findOne(asepect.serialize());

		if (!Guards.IsNil(already_exists)) throw "asepect already exists";

		return AspectModel.create(asepect.serialize());
	}

	public static async CreateMany(aspects: Aspect[]) {
		await Mongo.Connection();

		//get all the hashes of the aspects
		const hashes = aspects.map((aspect) => aspect.getHashCode());

		//get all the aspects that already exist using the these hashes
		const existingAspects = await AspectModel.find({ hash: { $in: hashes } })
			.select("hash")
			.lean();

		//get the last aspect_id
		let lastAspectId =
			existingAspects.length > 0 ? existingAspects.reduce((maxId, aspect) => Math.max(maxId, aspect.aspect_id ?? 0), 0) : 0;

		//filter hashes that already exist, and if they don't exist, increase the aspect_id
		const existingAspectHashes = new Set(existingAspects.map((aspect) => aspect.hash));

		const newAspects = aspects.filter((aspect) => {
			const hashCode = aspect.getHashCode();
			if (Guards.IsNil(hashCode)) return true;
			return !existingAspectHashes.has(hashCode);
		});

		newAspects.forEach((aspect) => {
			aspect.setAspectId(lastAspectId);
			lastAspectId++;
		});

		//create the new aspects
		const newAspectsData = newAspects.map((aspect) => aspect.serialize()) as AspectCreationData[];
		return await AspectModel.create(newAspectsData);
	}

	public static async Update(data: AspectUpdateData): Promise<AspectModel>;
	public static async Update(_id: string, data?: AspectUpdateData): Promise<AspectModel>;
	public static async Update(_idOrData: string | AspectUpdateData, data?: AspectUpdateData): Promise<AspectModel> {
		await Mongo.Connection();
		let filter;
		let updateData;
		if (Guards.IsNil(data)) throw "Undefined|null data provided!";
		if (Guards.IsString(_idOrData)) {
			const { aspect_id, hash, ...rest } = data;
			filter = { _id: _idOrData };
			updateData = rest;
		} else {
			const { aspect_id, hash, ...rest } = _idOrData;
			filter = Guards.IsNil(aspect_id) ? { hash: hash } : { aspect_id: aspect_id };
			updateData = rest;
		}
		const updated = await AspectModel.findOneAndUpdate<AspectModel>(filter, updateData, { new: false });
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

		return await AspectModel.bulkWrite(bulkOperations);
	}

	public static async Delete(aspectData: AspectRetrieveData): Promise<mongoose.mongo.DeleteResult> {
		await Mongo.Connection();
		const filter = Guards.IsNil(aspectData.aspect_id) ? { hash: aspectData.hash } : { aspect_id: aspectData.aspect_id };
		return AspectModel.deleteOne(filter);
	}

	public static async DeleteMany(data: AspectDeleteData[]): Promise<mongoose.mongo.BulkWriteResult> {
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
