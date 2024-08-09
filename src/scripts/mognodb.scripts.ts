import Lib from "common/lib";
import Mongo from "database/mongodb.database";
import { main } from "main/index";
import { UserModel } from "models/users.model";

const run = async () => {
	await Mongo.Connection();
	const new_user = await UserModel.findOne({
		username: "admin",
	});
	if (!new_user) return;
	await new_user.generateApiKey(true);
	console.log(new_user);
	process.exit(0);
};

await run();
