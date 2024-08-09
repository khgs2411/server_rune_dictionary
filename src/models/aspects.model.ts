import mongoose from "mongoose";

const aspectsSchema = new mongoose.Schema({
	aspect_id: { type: Number, required: false, unique: true }, //? auto increment
	name: { type: String, required: true, unique: true },
	weight: { type: Number, required: true },
	type: { type: String, required: false },
	rune_ids: { type: [Number], required: false },
});

aspectsSchema.pre("save", async function (next) {
	const aspect = this;

	if (aspect.isNew) {
		// Get the current highest aspect_id and increment it
		const lastAspect = await mongoose.model("Aspect").findOne().sort({ aspect_id: -1 }).exec();
		aspect.aspect_id = lastAspect ? lastAspect.aspect_id + 1 : 0;
	}

	next();
});

export type AspectsModel = mongoose.InferSchemaType<typeof aspectsSchema>;
export const AspectsModel = mongoose.model("Aspect", aspectsSchema);
