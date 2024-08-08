import Guards from "common/guards";
import Lib from "common/lib";
import Mongo from "database/mongodb.database";
import { User } from "models/Users";

class UsersRepo {
	public static async Validate(api_key?: string) {
		if (Lib.IsNumpty(api_key)) throw "Unauthorized!";

		await Mongo.Connection();

		Lib.Log("api_key", api_key);

		const user = await User.findOne({
			api_key: api_key,
		});

		Lib.Log("user: ", user);

		if (Guards.IsNil(user)) throw "Unauthorized!!";

		return user;
	}

	public static async Create(username: string) {
		await Mongo.Connection();

		const user = await User.findOne({
			username: username,
		});

		if (!Guards.IsNil(user)) throw "Username already exists";

		const new_user = new User({
			username: username,
		});

		new_user.generateApiKey();
		await new_user.save();
		return new_user;
	}

	public static async Delete(username: string) {
		await Mongo.Connection();

		const user = await User.findOne({
			username: username,
		});

		if (Guards.IsNil(user)) throw "Username does not exist";

		await User.deleteOne({
			username: username,
		});
	}
}

export default UsersRepo;
