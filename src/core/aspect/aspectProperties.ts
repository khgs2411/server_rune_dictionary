import type { IAspectProperties } from "./aspect.types";
import type { Dto, Serializable } from "common/dto";

class AspectProperties implements IAspectProperties, Serializable<AspectProperties> {
	is_damage: number;
	is_typed: number;
	is_percent: number;
	is_convert: number;
	is_duration: number;
	is_range: number;
	hit_count: number;
	cooldown: number;
	wait_turns: number;
	is_stun: number;
	is_slow: number;
	is_retaliate: number;
	is_silence: number;
	is_sleep: number;
	is_taunt: number;
	is_fear: number;
	is_confuse: number;
	is_charm: number;
	is_heal: number;
	is_frenzy: number;

	constructor(data: Partial<IAspectProperties> | undefined) {
		this.is_damage = data?.is_damage ?? 0;
		this.is_typed = data?.is_typed ?? 0;
		this.is_percent = data?.is_percent ?? 0;
		this.is_convert = data?.is_convert ?? 0;
		this.is_duration = data?.is_duration ?? 0;
		this.is_range = data?.is_range ?? 0;
		this.hit_count = data?.hit_count ?? 0;
		this.cooldown = data?.cooldown ?? 0;
		this.wait_turns = data?.wait_turns ?? 0;
		this.is_stun = data?.is_stun ?? 0;
		this.is_slow = data?.is_slow ?? 0;
		this.is_retaliate = data?.is_retaliate ?? 0;
		this.is_silence = data?.is_silence ?? 0;
		this.is_sleep = data?.is_sleep ?? 0;
		this.is_taunt = data?.is_taunt ?? 0;
		this.is_fear = data?.is_fear ?? 0;
		this.is_confuse = data?.is_confuse ?? 0;
		this.is_charm = data?.is_charm ?? 0;
		this.is_heal = data?.is_heal ?? 0;
		this.is_frenzy = data?.is_frenzy ?? 0;
	}

	serialize(): Dto<AspectProperties> {
		return this;
	}
}
export default AspectProperties;
