import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({
	username: { type: String, required: true },
	api_key: { type: String, required: false },
});

export type User = mongoose.InferSchemaType<typeof usersSchema>;
export const User = mongoose.model("User", usersSchema);
