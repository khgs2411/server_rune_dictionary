import Lib from "common/lib";
import Mongo from "database/mongodb.database";
import { main } from "main/index";
import { User } from "models/Users";

const run = async () => {
	await Mongo.Connection();
	const new_user = await User.findOne({
		username: "admin",
	});
	if (!new_user) return;
	await new_user.generateApiKey(true);
	console.log(new_user);
	process.exit(0);
};

await run();
