import mongoose from "mongoose";
import { Guards, Lib } from "topsyde-utils";

export enum ROLES {
	USER = "user",
	ADMIN = "admin",
}

const usersSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		api_key: { type: String, required: false, unique: true },
		role: { type: mongoose.Schema.Types.String, required: true, default: ROLES.USER },
	},
	{
		toJSON: { virtuals: true },
		toObject: { virtuals: true },
		methods: {
			async generateApiKey(generate_new_key: boolean = false) {
				if (generate_new_key || Guards.IsNil(this.api_key)) {
					const key = "r_d_" + Lib.UUID();
					Lib.Log("Generating new API key: " + key);
					this.api_key = key;
					await this.save();
				}
				return this.api_key;
			},
		},
	},
);

type UserModelType = mongoose.InferSchemaType<typeof usersSchema>;
export type UserModel = mongoose.HydratedDocument<UserModelType>;
export const UserModel = mongoose.model("User", usersSchema);
