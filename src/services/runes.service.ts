import { Actions } from "common/enums";
import Guards from "common/guards";
import type { ProcessArgs } from "common/types";
import Rune from "core/rune/rune";
import { IsRuneCreationData, IsRuneDeleteData, IsRuneUpdateData, type RuneCreationData } from "core/rune/rune.types";
import RuneRepository from "repositories/runes.repo";

class RuneService {
	run: Record<string, Function>;
	constructor() {
		this.run = {
			[Actions.RUNE_GET_RUNE]: () => {
				throw "Not Implemented!";
			},
			[Actions.RUNE_GET_RUNES]: () => {
				throw "Not Implemented!";
			},
			[Actions.RUNE_INSERT_RUNE]: this.createRune,
			[Actions.RUNE_INSERT_RUNES]: this.createRunes,
			[Actions.RUNE_UPDATE_RUNE]: this.updateRune,
			[Actions.RUNE_UPDATE_RUNES]: this.updateRunes,
			[Actions.RUNE_DELETE_RUNE]: this.deleteRune,
			[Actions.RUNE_DELETE_RUNES]: this.deleteRunes,
		};
	}

	public async call(args: ProcessArgs) {
		const action = args.instructions.action;
		const run = this.run[action];
		if (!run) throw "Invalid action provided!";
		return await run(args.instructions.data);
	}

	private async createRune(data: any) {
		if (!IsRuneCreationData(data)) throw "Invalid data provided!";
		const rune = new Rune(data);
		const new_rune = await RuneRepository.Create(rune);
		return {
			msg: "Success!",
			rune: new_rune.toJSON(),
		};
	}

	private async createRunes(data: any) {
		if (!Guards.IsArray(data)) throw "Invalid data provided!";
		if (!data.every((item: any) => IsRuneCreationData(item))) throw "Invalid data provided!!";
		const runes = data.map((rune: RuneCreationData) => new Rune(rune));
		const new_runes = await RuneRepository.CreateMany(runes);
		return {
			msg: "Success!",
			runes: new_runes.map((rune) => rune.toJSON()),
		};
	}

	private async updateRune(data: any) {
		if (!IsRuneUpdateData(data)) throw "Invalid data provided!";
		const updated = await RuneRepository.Update(data);
		return {
			msg: "Success!",
			updated,
		};
	}

	private async updateRunes(data: any) {
		if (!Guards.IsArray(data)) throw "Invalid data provided!";
		if (!data.every((item: any) => IsRuneUpdateData(item))) throw "Invalid data provided!!";
		const updated = await RuneRepository.UpdateMany(data);
		return {
			msg: "Success!",
			updated,
		};
	}

	private async deleteRune(data: any) {
		if (!IsRuneDeleteData(data)) throw "Invalid data provided!";
		const deleted = await RuneRepository.Delete(data);
		return {
			msg: "Success!",
			deleted,
		};
	}
	private async deleteRunes(data: any) {
		if (!Guards.IsArray(data)) throw "Invalid data provided!";
		if (!data.every((item: any) => IsRuneDeleteData(item))) throw "Invalid data provided!!";
		const deleted = await RuneRepository.DeleteMany(data);
		return {
			msg: "Success!",
			deleted,
		};
	}
}

export default RuneService;
