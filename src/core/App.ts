import { Actions } from "common/enums";
import Guards from "common/guards";
import Lib from "common/lib";
import type { Request, Instructions } from "common/types";
import type { User } from "models/Users";
import UsersRepo from "repositories/users.repo";

class App {
	constructor() {}

	public static async Request(args: Request): Promise<{ user: User; instructions: Instructions }> {
		const user = await UsersRepo.Validate(args.api_key);
		const instructions = this.HandleRequest(args);
		return { user, instructions };
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
			body: {
				message: e,
			},
			code: code,
		};
	}

	static HandleRequest(args: Request): Instructions {
		if (Guards.IsNil(args.action) || Lib.IsEmpty(args.action)) throw "No action provided!";
		if (!Object.values(Actions).includes(args.action)) throw "Invalid action provided!";
		if (Guards.IsNil(args.data) || Lib.IsEmpty(args.data)) throw "No data provided!";
		return {
			action: args.action,
			data: args.data,
		};
	}
}

export default App;
