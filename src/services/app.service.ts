import Guards from "common/guards";
import Lib from "common/lib";
import Mongo from "database/mongodb.database";
import { User } from "models/Users";

class App {
	public static async Request(args: DoFunctionArgs) {
		if (Lib.IsNumpty(args.api_key)) throw "Unauthorized!";
		await Mongo.Connection();
		const api_key = args.api_key;
		console.log("api_key", api_key);
		const user = await User.findOne({
			api_key: api_key,
		});
		console.log("user: ", user);
		if (Guards.IsNil(user)) throw "Unauthorized!!";
	}

	public static Response(body?: any) {
		return {
			body: body,
			status: 200,
		};
	}

	public static Error(status: number = 401, e: unknown) {
		console.log(status, e);
		return {
			body: {
				message: e,
			},
			status: status,
		};
	}
}

export default App;
