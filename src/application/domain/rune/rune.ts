import type { Serializable, Dto } from "common/dto";
import type { RuneCreationData } from "./rune.types";
import { BOOLEANISH } from "common/enums";

class Rune implements Serializable<Rune> {
	private rune_id?: number;
	private name: string;
	private weight: number;
	private type: BOOLEANISH;

	constructor(data: RuneCreationData) {
		this.name = data.name;
		this.weight = data.weight;
		this.type = data.type ?? BOOLEANISH.FALSE;
	}

	serialize(): Dto<Rune> {
		return this;
	}
}
export default Rune;
