import { Actions } from "common/enums";
import Guards from "common/guards";
import Lib from "common/lib";
import type { ProcessArgs } from "common/types";
import Aspect from "core/aspect/aspect";
import {
	type AspectDeleteData,
	type AspectRetrieveData,
	type AspectUpdateData,
	IsAspectCreationData,
	IsAspectDeleteData,
	IsAspectRetrieveData,
	IsAspectUpdateData,
} from "core/aspect/aspect.types";
import AspectRepository from "repositories/aspect.repo";

export default class AspectService {
	run: Record<string, Function>;
	constructor() {
		this.run = {
			[Actions.ASPECT_GET_ASPECT]: () => {
				throw "Not Implemented!";
			},
			[Actions.ASPECT_GET_ASPECTS]: this.getAspects,
			[Actions.ASPECT_INSERT_ASPECT]: this.createAspect,
			[Actions.ASPECT_INSERT_ASPECTS]: this.createAspects,
			[Actions.ASPECT_UPDATE_ASPECT]: this.updateAspect,
			[Actions.ASPECT_UPDATE_ASPECTS]: this.updateAspects,
			[Actions.ASPECT_DELETE_ASPECT]: this.deleteAspect,
			[Actions.ASPECT_DELETE_ASPECTS]: this.deleteAspects,
		};
	}

	public static async Call(args: ProcessArgs) {
		const self = new AspectService();
		const action = args.strategy.action;
		const run = self.run[action];
		if (!run) throw "aspects.call - Invalid action provided!";
		return await run(args.strategy.data);
	}

	private async getAspects(data: any) {
		if (!Guards.IsArray(data)) throw "getAspects Invalid data provided!";
		if (!Lib.IsEmpty(data) && !data.every((item: any) => IsAspectRetrieveData(item))) throw "getAspects Invalid data provided!!";
		const aspects = await AspectRepository.Get(data as AspectRetrieveData[]);

		return {
			msg: "Success!",
			aspects: aspects,
		};
	}

	private async createAspect(data: any) {
		const aspect = new Aspect(data);
		if (!IsAspectCreationData(aspect.serialize())) throw "createAspect Invalid data provided!";
		const new_aspect = await AspectRepository.Create(aspect);
		return {
			msg: "Success!",
			aspect: new_aspect.toJSON(),
		};
	}

	private async createAspects(data: any) {
		if (!Guards.IsArray(data)) throw "createAspects Invalid data provided!";
		const aspects = (data as any[]).map((item) => new Aspect(item));
		if (!aspects.every((aspect: any) => IsAspectCreationData(aspect))) throw "createAspects Invalid data provided!!";
		const new_aspects = await AspectRepository.CreateMany(aspects);
		return {
			msg: "Success!",
			aspects: new_aspects.map((aspect) => aspect.toJSON()),
		};
	}

	private async updateAspect(data: any) {
		if (!IsAspectUpdateData(data)) throw "updateAspect Invalid data provided!";
		const updated = await AspectRepository.Update(data);
		return {
			msg: "Success!",
			updated,
		};
	}

	private async updateAspects(data: any) {
		if (!Guards.IsArray(data)) throw "updateAspects Invalid data provided!";
		if (!data.every((item: any) => IsAspectUpdateData(item))) throw "updateAspects Invalid data provided!!";
		const updated = await AspectRepository.UpdateMany(data as AspectUpdateData[]);
		return {
			msg: "Success!",
			updated,
		};
	}

	private async deleteAspect(data: any) {
		if (!IsAspectDeleteData(data)) throw "deleteAspect Invalid data provided!";
		const deleted = await AspectRepository.Delete(data);
		return {
			msg: "Success!",
			deleted,
		};
	}

	private async deleteAspects(data: any) {
		if (!Guards.IsArray(data)) throw "deleteAspects Invalid data provided!";
		if (!data.every((item: any) => IsAspectDeleteData(item))) throw "deleteAspects Invalid data provided!!";
		const deleted = await AspectRepository.DeleteMany(data as AspectDeleteData[]);
		return {
			msg: "Success!",
			deleted,
		};
	}
}
