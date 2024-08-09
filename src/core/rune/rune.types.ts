import Guards from "common/guards";

export type RuneRetrieveData = {
	rune_id?: number;
	name?: string;
};

export type RuneCreationData = {
	name: string;
	weight: number;
	type?: string;
	rune_id?: number;
};

export type RuneUpdateData = {
	rune_id?: number;
	name?: string;
	weight?: number;
	type?: string;
};

export function IsRuneRetrieveData(args: any): args is RuneRetrieveData {
	return (
		!Guards.IsNil(args) &&
		typeof args === "object" &&
		Object.keys(args).length > 0 &&
		Object.values(args).some((value) => !Guards.IsNil(value))
	);
}

export function IsRuneCreationData(args: any): args is RuneCreationData {
	return (
		typeof args === "object" &&
		args !== null &&
		typeof args.name === "string" &&
		typeof args.weight === "number" &&
		(args.type ? typeof args.type === "string" : true)
	);
}

export function IsRuneUpdateData(args: any): args is RuneUpdateData {
	return (
		!Guards.IsNil(args) &&
		typeof args === "object" &&
		Object.keys(args).length > 0 &&
		Object.values(args).some((value) => !Guards.IsNil(value))
	);
}
