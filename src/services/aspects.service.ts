import { Actions } from "common/enums";
import Guards from "common/guards";
import type { ProcessArgs } from "common/types";
import Aspect from "core/aspect/aspect";
import {
	IsAspectRetrieveData,
	IsAspectCreationData,
	type AspectCreationData,
	IsAspectUpdateData,
	type AspectRetrieveData,
	type AspectUpdateData,
} from "core/aspect/aspect.types";
import AspectRepository from "repositories/aspect.repo";

class AspectService {
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

	public async call(args: ProcessArgs) {
		const action = args.instructions.action;
		const run = this.run[action];
		if (!run) throw "aspects.call - Invalid action provided!";
		return await run(args.instructions.data);
	}

	private async getAspects(data: AspectRetrieveData[]) {
		if (!Guards.IsArray(data)) throw "getAspects Invalid data provided!";
		if (!data.every((item: any) => IsAspectRetrieveData(item))) throw "getAspects Invalid data provided!!";
		const aspects = await AspectRepository.Get(data);

		return {
			msg: "Success!",
			aspects: aspects.map((aspect) => aspect.toJSON()),
		};
	}

	private async createAspect(data: AspectCreationData) {
		const aspect = new Aspect(data);
		if (!IsAspectCreationData(aspect.serialize())) throw "createAspect Invalid data provided!";
		const new_aspect = await AspectRepository.Create(aspect);
		return {
			msg: "Success!",
			aspect: new_aspect.toJSON(),
		};
	}

	private async createAspects(data: AspectCreationData[]) {
		if (!Guards.IsArray(data)) throw "createAspects Invalid data provided!";
		const aspects = (data as any[]).map((item) => new Aspect(item));
		if (!aspects.every((aspect: any) => IsAspectCreationData(aspect))) throw "createAspects Invalid data provided!!";
		const new_aspects = await AspectRepository.CreateMany(aspects);
		return {
			msg: "Success!",
			aspects: new_aspects.map((aspect) => aspect.toJSON()),
		};
	}

	private async updateAspect(data: AspectUpdateData) {
		if (!IsAspectUpdateData(data)) throw "updateAspect Invalid data provided!";
		const updated = await AspectRepository.Update(data);
		return {
			msg: "Success!",
			updated,
		};
	}

	private async updateAspects(data: AspectUpdateData[]) {
		if (!Guards.IsArray(data)) throw "updateAspects Invalid data provided!";
		if (!data.every((item: any) => IsAspectUpdateData(item))) throw "updateAspects Invalid data provided!!";
		const updated = await AspectRepository.UpdateMany(data);
		return {
			msg: "Success!",
			updated,
		};
	}

	private async deleteAspect(data: AspectRetrieveData) {
		if (!IsAspectRetrieveData(data)) throw "deleteAspect Invalid data provided!";
		const deleted = await AspectRepository.Delete(data);
		return {
			msg: "Success!",
			deleted,
		};
	}
	private async deleteAspects(data: AspectRetrieveData[]) {
		if (!Guards.IsArray(data)) throw "deleteAspects Invalid data provided!";
		if (!data.every((item: any) => IsAspectRetrieveData(item))) throw "deleteAspects Invalid data provided!!";
		const deleted = await AspectRepository.DeleteMany(data);
		return {
			msg: "Success!",
			deleted,
		};
	}
}
export default AspectService;
