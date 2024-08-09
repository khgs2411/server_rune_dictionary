import { Actions } from "common/enums";
import Guards from "common/guards";
import Lib from "common/lib";
import type { Instructions, ProcessArgs, Request } from "common/types";
import UsersRepository from "repositories/users.repo";
import RuneService from "services/runes.service";

class App {
	constructor() {}

	public static async Request(args: DoFunctionArgs): Promise<ProcessArgs> {
		const user = await UsersRepository.Validate(args.api_key);
		const instructions = this.HandleRequest(args as Request);
		return { user, instructions };
	}

	public static async Process(args: ProcessArgs) {
		switch (args.instructions.service) {
			case "rune":
				const service = new RuneService();
				return await service.call(args);
			case "affix":
				break;
		}
	}

	public static Response(body?: any) {
		return {
			body: body,
			code: 200,
		};
	}

	public static Error(code: number = 401, e: unknown) {
		Lib.Warn(code, e);
		return {
			body: e,
			code: code,
		};
	}

	private static HandleRequest(args: Request): Instructions {
		if (Guards.IsNil(args.action) || Lib.IsEmpty(args.action)) throw "No action provided!";
		if (!Object.values(Actions).includes(args.action)) throw "Invalid action provided!";
		if (Guards.IsNil(args.data) || Lib.IsEmpty(args.data)) throw "No data provided!";
		const service = args.action.includes("rune") ? "rune" : args.action.includes("affix") ? "affix" : "unknown";
		if (service === "unknown") throw "Invalid action provided!";
		return {
			action: args.action,
			data: args.data,
			service: service,
		};
	}
}

export default App;
