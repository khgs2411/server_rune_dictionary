import type { BOOLEANISH, BOOLEANISH as number } from "common/enums";
import Guards from "common/guards";

export type AspectRetrieveData = {
	aspect_id?: number;
	hash?: string;
};

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
	is_damage?: number;
	is_typed?: number;
	is_dot?: number;
	is_range?: number;
	/**
	 *? will always get added to the combat ability hit count - if 0, then it's a single hit, if bigger than 1, then it's a multi-hit (e.g 1 = base hit + 1 extra hit, 2 = base hit + 2 extra hits)
	 */
	hit_count?: number;
	wait_turns?: number;
	percent?: number;
	/**
	 * !required is_damage to be 1
	 * !required is_typed to be 1
	 *? if bigger than 1, then we flat conversion, if 0|1, then we use the percentage to calculate the conversion
	 */
	convert?: BOOLEANISH | number;
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

export function IsAspectCreationData(args: any): args is AspectCreationData {
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
		typeof args.is_damage === "number" &&
		typeof args.is_typed === "number" &&
		typeof args.is_dot === "number" &&
		typeof args.is_range === "number" &&
		typeof args.hit_count === "number" &&
		typeof args.wait_turns === "number" &&
		typeof args.percent === "number" &&
		typeof args.convert === "number"
	);
}

export function IsAspectUpdateData(args: any): args is AspectUpdateData {
	return !Guards.IsNil(args) && typeof args === "object" && Object.keys(args).length > 0 && args.tier
		? args.tier > 0
		: true && Object.values(args).some((value) => !Guards.IsNil(value));
}
