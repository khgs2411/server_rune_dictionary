import { Actions } from "common/enums";
import Guards from "common/guards";
import Lib from "common/lib";
import { type ProcessArgs, type Request, type Strategy } from "common/types";
import { StrategyType } from "common/enums";
import AspectService from "services/aspects.service";
import AuthService from "services/auth.service";
import RuneService from "services/runes.service";

class App {
	public static async Request(args: DoFunctionArgs): Promise<ProcessArgs> {
		const user = await AuthService.Authenticate(args.api_key);
		const strategy = this.setActionStrategy(args as Request);
		return { user, strategy };
	}

	public static async Process(args: ProcessArgs) {
		return await this.StrategyCall(args.strategy.type)(args);
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

	private static setActionStrategy(args: Request): Strategy {
		if (Guards.IsNil(args.action) || Lib.IsEmpty(args.action)) throw "No action provided!";
		if (!Object.values(Actions).includes(args.action)) throw "Invalid action provided!";

		if (Guards.IsNil(args.data)) throw "No data provided!";

		const action_type = args.action.split("_")[0];
		if (Guards.IsNil(action_type)) throw "Invalid action provided!";

		const type = Object.values(StrategyType).includes(action_type as StrategyType) ? (action_type as StrategyType) : "unknown";
		if (type === "unknown") throw "Invalid action provided!!";

		return {
			action: args.action,
			data: args.data,
			type: type,
		};
	}

	private static StrategyCall(strategyType: StrategyType) {
		const types = {
			rune: RuneService.Call,
			aspect: AspectService.Call,
			auth: AuthService.Call,
		};
		return types[strategyType];
	}
}

export default App;
