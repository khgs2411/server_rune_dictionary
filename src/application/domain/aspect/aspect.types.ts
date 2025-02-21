import type { BOOLEANISH } from "common/enums";
import Guards from "common/guards";

export interface IAspectProperties {
	is_damage: BOOLEANISH;
	is_typed: BOOLEANISH;
	is_convert: number;
	is_percent: BOOLEANISH;
	is_duration: BOOLEANISH;
	is_range: BOOLEANISH;
	hit_count: BOOLEANISH;
	cooldown: BOOLEANISH;
	wait_turns: BOOLEANISH;
	is_stun: BOOLEANISH;
	is_slow: BOOLEANISH;
	is_retaliate: BOOLEANISH;
	is_silence: BOOLEANISH;
	is_sleep: BOOLEANISH;
	is_taunt: BOOLEANISH;
	is_fear: BOOLEANISH;
	is_confuse: BOOLEANISH;
	is_charm: BOOLEANISH;
	is_heal: BOOLEANISH;
	is_frenzy: BOOLEANISH;
}

export interface IPropertiesSchema extends Document, IAspectProperties {}

export type AspectRetrieveData = {
	aspect_id?: number;
	hash?: string;
};

export type AspectDeleteData = AspectRetrieveData

export type AspectCreationData = {
	tier: 1 | 2 | 3 | 4;
	weight: number;
	potency: number;
	/**
	 *? runes that can be used in the generation process to roll this aspect
	 */
	rune_ids: number[];
	/**
	 *? runes that are required in the generation process to be able to roll this aspect
	 */
	required_rune_ids: number[];
	/**
	 *? aspects that can't be rolled with this aspect
	 */
	blocked_aspect_ids: number[];
	properties?: Partial<IAspectProperties>;
};

export type AspectUpdateData = Partial<AspectCreationData> & {
	aspect_id?: number;
	hash?: string;
	[key: string]: any; // Add index signature
};

export function IsAspectRetrieveData(args: any): args is AspectRetrieveData {
	return (
		!Guards.IsNil(args) &&
		typeof args === "object" &&
		Object.keys(args).length > 0 &&
		Object.values(args).some((value) => !Guards.IsNil(value))
	);
}

export function IsAspectDeleteData(args: any): args is AspectDeleteData {
	return IsAspectRetrieveData(args);
}

export function IsAspectCreationData(args: any): args is AspectCreationData {
	// logValidations(args);
	return (
		typeof args === "object" &&
		args !== null &&
		typeof args.tier === "number" &&
		args.tier > 0 &&
		typeof args.weight === "number" &&
		typeof args.potency === "number" &&
		Array.isArray(args.rune_ids) &&
		Array.isArray(args.required_rune_ids) &&
		Array.isArray(args.blocked_aspect_ids) &&
		typeof args.properties === "object" &&
		args.properties !== null &&
		//every property is number
		Object.values(args.properties).every((value) => typeof value === "number")
	);
}

function logValidations(args: any) {
	if (typeof args !== "object") {
		console.log('typeof args === "object"', typeof args === "object");
	}
	if (args === null) {
		console.log("args !== null", args !== null);
	}
	if (typeof args.tier !== "number") {
		console.log('typeof args.tier === "number"', typeof args.tier === "number");
	}
	if (args.tier <= 0) {
		console.log("args.tier > 0", args.tier > 0);
	}
	if (typeof args.weight !== "number") {
		console.log('typeof args.weight === "number"', typeof args.weight === "number");
	}
	if (typeof args.potency !== "number") {
		console.log('typeof args.potency === "number"', typeof args.potency === "number");
	}
	if (!Array.isArray(args.rune_ids)) {
		console.log("Array.isArray(args.rune_ids)", Array.isArray(args.rune_ids));
	}
	if (!Array.isArray(args.required_rune_ids)) {
		console.log("Array.isArray(args.required_rune_ids)", Array.isArray(args.required_rune_ids));
	}
	if (!Array.isArray(args.blocked_aspect_ids)) {
		console.log("Array.isArray(args.blocked_aspect_ids)", Array.isArray(args.blocked_aspect_ids));
	}
	if (typeof args.is_damage !== "number") {
		console.log('typeof args.is_damage === "number"', typeof args.is_damage === "number");
	}
	if (typeof args.is_typed !== "number") {
		console.log('typeof args.is_typed === "number"', typeof args.is_typed === "number");
	}
	if (typeof args.is_dot !== "number") {
		console.log('typeof args.is_dot === "number"', typeof args.is_dot === "number");
	}
	if (typeof args.is_range !== "number") {
		console.log('typeof args.is_range === "number"', typeof args.is_range === "number");
	}
	if (typeof args.hit_count !== "number") {
		console.log('typeof args.hit_count === "number"', typeof args.hit_count === "number");
	}
	if (typeof args.wait_turns !== "number") {
		console.log('typeof args.wait_turns === "number"', typeof args.wait_turns === "number");
	}
	if (typeof args.percent !== "number") {
		console.log('typeof args.percent === "number"', typeof args.percent === "number");
	}
	if (typeof args.convert !== "number") {
		console.log('typeof args.convert === "number"', typeof args.convert === "number");
	}
}

export function IsAspectUpdateData(args: any): args is AspectUpdateData {
	return !Guards.IsNil(args) && typeof args === "object" && Object.keys(args).length > 0 && args.tier
		? args.tier > 0
		: true && Object.values(args).some((value) => !Guards.IsNil(value));
}
