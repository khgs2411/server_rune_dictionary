import Guards from "common/guards";
import Lib from "common/lib";
import Mongo from "database/mongodb.database";
import { ROLES, UserModel } from "models/users.model";

export type UserData = {
	username: string;
	api_key?: string;
	role?: ROLES;
};

export default class UsersRepository {
	public static async Validate(username?: string, api_key?: string): Promise<UserModel>;
	public static async Validate(api_key?: string): Promise<UserModel>;
	public static async Validate(username_or_api_key?: string, api_key?: string): Promise<UserModel> {
		if (Lib.IsNumpty(username_or_api_key)) throw "Unauthorized!";

		await Mongo.Connection();

		const data: { api_key: string | undefined; username?: string } = {
			api_key: username_or_api_key,
		};

		if (!Lib.IsNumpty(api_key)) {
			data["username"] = username_or_api_key;
			data["api_key"] = api_key;
		}

		const user = await UserModel.findOne(data);

		if (Guards.IsNil(user)) throw "Unauthorized!!";

		return user;
	}

	public static async Create(username: string) {
		await Mongo.Connection();

		const user = await UserModel.findOne({
			username: username,
		});

		if (!Guards.IsNil(user)) throw "Username already exists";

		const new_user = new UserModel({
			username: username,
		});

		new_user.generateApiKey();
		await new_user.save();
		return new_user;
	}

	public static async Delete(username: string) {
		await Mongo.Connection();

		const user = await UserModel.findOne({
			username: username,
		});

		if (Guards.IsNil(user)) throw "Username does not exist";

		await UserModel.deleteOne({
			username: username,
		});
	}

	public static async Update(data: UserData) {
		await Mongo.Connection();
		const user = await UserModel.findOne({
			username: data.username,
		});
		if (Guards.IsNil(user)) throw "Username does not exist";
		if (data.api_key) {
			user.api_key = data.api_key;
		}
		if (data.role) {
			user.role = data.role;
		}
		await user.save();
		return user;
	}
}
