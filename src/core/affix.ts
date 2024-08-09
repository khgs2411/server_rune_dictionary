import type { Dto, Serializable } from "common/dto";

class Affix implements Serializable<Affix> {
	serialize(): Dto<Affix> {
		throw new Error("Method not implemented.");
	}
}
export default Affix;
