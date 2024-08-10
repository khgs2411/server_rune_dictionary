import type { BOOLEANISH } from "common/enums";
import Guards from "common/guards";

export type RuneRetrieveData = {
	rune_id?: number;
	name?: string;
};

export type RuneCreationData = {
	name: string;
	type: BOOLEANISH;
	weight: number;
	rune_id?: number;
};

export type RuneUpdateData = Partial<RuneCreationData>;

export function IsRuneRetrieveData(args: any): args is RuneRetrieveData {
	return (
		!Guards.IsNil(args) &&
		typeof args === "object" &&
		Object.keys(args).length > 0 &&
		Object.values(args).some((value) => !Guards.IsNil(value))
	);
}

export function IsRuneCreationData(args: any): args is RuneCreationData {
	// logValidations(args);

	return (
		typeof args === "object" &&
		args !== null &&
		typeof args.name === "string" &&
		typeof args.weight === "number" &&
		(args.type ? typeof args.type === "number" : true)
	);
}

function logValidations(args: any) {
	if (typeof args !== "object") {
		console.log('typeof args === "object"', typeof args === "object");
	}
	if (args === null) {
		console.log("args !== null", args !== null);
	}
	if (typeof args.name !== "string") {
		console.log('typeof args.name === "string"', typeof args.name === "string");
	}
	if (typeof args.weight !== "number") {
		console.log('typeof args.weight === "number"', typeof args.weight === "number");
	}
	if (args.type && args.type !== "number") {
		console.log('args.type !== "number"', args.type !== "number");
	}
}

export function IsRuneUpdateData(args: any): args is RuneUpdateData {
	return (
		!Guards.IsNil(args) &&
		typeof args === "object" &&
		Object.keys(args).length > 0 &&
		Object.values(args).some((value) => !Guards.IsNil(value))
	);
}
