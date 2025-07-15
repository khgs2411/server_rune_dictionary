import Mongo from "database/connections/mongodb.database";
import { UserModel } from "database/models/users.model";

export const run = async () => {
	await Mongo.Connection();
	const new_user = new UserModel({
		username: "yazin",
		role: "admin",
	});
	await new_user.generateApiKey(true);
	console.log(new_user);
	process.exit(0);
};


