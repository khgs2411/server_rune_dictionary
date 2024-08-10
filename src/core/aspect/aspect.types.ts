import type { BOOLEANISH, BOOLEANISH as number } from "common/enums";
import Guards from "common/guards";

export type AspectRetrieveData = {
	aspect_id?: number;
	hash?: string;
};

export type AspectCreationData = {
	tier: number;
	weight: number;
	potency: number;
	rune_ids: number[];
	required_rune_ids: number[];
	blocked_rune_ids: number[];
	is_damage: number;
	is_typed: number;
	is_dot: number;
	is_range: number;
	hit_count: number;
	wait_turns: number;
	percent: number;
	convert: BOOLEANISH | number; // if bigger than 1, then we flat conversion, if 0|1, then we use the percentage to calculate the conversion
};

export type AspectUpdateData = {
	aspect_id?: number;
	hash?: string;
	tier?: number;
	weight?: number;
	potency?: number;
	rune_ids?: number[];
	required_rune_ids?: number[];
	blocked_rune_ids?: number[];
	is_damage?: number;
	is_typed?: number;
	is_dot?: number;
	is_range?: number;
	hit_count?: number;
	wait_turns?: number;
	percent?: number;
	convert?: BOOLEANISH | number;
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
	return (
		typeof args === "object" &&
		args !== null &&
		typeof args.tier === "number" &&
		typeof args.weight === "number" &&
		typeof args.potency === "number" &&
		Array.isArray(args.rune_ids) &&
		Array.isArray(args.required_rune_ids) &&
		Array.isArray(args.blocked_rune_ids) &&
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
	return (
		!Guards.IsNil(args) &&
		typeof args === "object" &&
		Object.keys(args).length > 0 &&
		Object.values(args).some((value) => !Guards.IsNil(value))
	);
}
