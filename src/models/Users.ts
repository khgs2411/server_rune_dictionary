import Guards from "common/guards";
import Lib from "common/lib";
import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
	{
		username: { type: String, required: true },
		api_key: { type: String, required: false },
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

usersSchema.virtual("id").get(function () {
	return this._id.toHexString();
});

export type User = mongoose.InferSchemaType<typeof usersSchema>;
export const User = mongoose.model("User", usersSchema);
