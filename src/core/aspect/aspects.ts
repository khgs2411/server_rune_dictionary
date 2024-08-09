import type { Dto, Serializable } from "common/dto";

/* 
tier: TIER;
	context: string;
	isType: IS_TYPE;
	isDmg: IS_DAMAGE;
	isDot: IS_DOT;
	isRange: IS_RANGE;
	hitCount: number;
	isWaitTurns: number;
	percent: number;
	isConvert: CONVERT;
*/

class Aspect implements Serializable<Aspect> {
	serialize(): Dto<Aspect> {
		return this;
	}
}
export default Aspect;
