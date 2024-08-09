import type { Serializable, Dto } from "common/dto";
import type { RuneCreationData } from "./rune.types";

class Rune implements Serializable<Rune> {
	private name: string;
	private weight: number;
	private type: string;
	private rune_id?: number;

	constructor(data: RuneCreationData) {
		this.name = data.name;
		this.weight = data.weight;
		this.type = data.type ?? "default";
	}

	serialize(): Dto<Rune> {
		return this;
	}
}
export default Rune;
