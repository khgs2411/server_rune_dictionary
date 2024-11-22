import { Actions } from "common/enums";
import Guards from "common/guards";
import Lib from "common/lib";
import { type ProcessArgs, type Request, type Strategy } from "common/types";
import { StrategyType } from "common/enums";
import AspectService from "services/aspects.service";
import AuthService from "services/auth.service";
import RuneService from "services/runes.service";

const HEADERS = {
	"Access-Control-Allow-Origin": "*", // Allow all origins for development
	"Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS", // Allow specific methods
	"Access-Control-Allow-Headers": "Content-Type, Authorization", // Allow specific headers
	"Access-Control-Allow-Credentials": "true", // Allow credentials
	"Content-Type": "application/json",
	"Access-Control-Max-Age": "86400", // 24 hours
};

class App {
	public static async Request(args: DoFunctionArgs): Promise<ProcessArgs> {
		const user = await AuthService.Authenticate(args.api_key);
		const strategy = this.setActionStrategy(args as Request);
		return { user, strategy };
	}

	public static async Process(args: ProcessArgs) {
		return await this.StrategyCall(args.strategy.type)(args);
	}

	public static Response(body?: any): DoFunctionReturn {
		return {
			body: body,
			statusCode: 200,
			headers: HEADERS,
		};
	}

	public static Error(code: number = 401, e: unknown): DoFunctionReturn {
		Lib.Warn(code, e);
		return {
			body: e,
			statusCode: code,
			headers: HEADERS,
		};
	}

	public static Preflight(): DoFunctionReturn {
		Lib.Log("Preflight request received");
		return {
			body: null,
			statusCode: 204,
			headers: HEADERS,
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
