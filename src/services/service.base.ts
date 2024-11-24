import type { ProcessArgs } from "common/types";

export interface RunFunctionReturn {
	status: boolean;
	[key: string]: any; // Allow additional properties
}
export default class BaseService {
	run!: Record<string, (data: any, args: ProcessArgs) => Promise<RunFunctionReturn>>;
}
