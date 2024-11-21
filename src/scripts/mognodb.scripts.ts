import Mongo from "database/mongodb.database";
import { UserModel } from "models/users.model";

export const run = async () => {
	await Mongo.Connection();
	const new_user = new UserModel({
		username: "tal",
		role: "admin",
	});
	await new_user.generateApiKey(true);
	console.log(new_user);
	process.exit(0);
};


