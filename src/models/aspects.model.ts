import mongoose from "mongoose";
const aspectsSchema = new mongoose.Schema({
	hash: { type: String, required: true },
	aspect_id: { type: Number, required: false, unique: true }, //? auto increment
	tier: { type: Number, required: true },
	weight: { type: Number, required: true },
	potency: { type: Number, required: true },
	rune_ids: { type: [Number], required: true },
	required_runes: { type: [Number], required: true },
	blocked_runes: { type: [Number], required: true },
	is_damage: { type: Number, required: true },
	is_typed: { type: Number, required: true },
	is_dot: { type: Number, required: true },
	is_range: { type: Number, required: true },
	hit_count: { type: Number, required: true },
	wait_turns: { type: Number, required: true },
	percent: { type: Number, required: true },
	convert: { type: Number, required: true },
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

export type AspectModel = mongoose.InferSchemaType<typeof aspectsSchema>;
export const AspectModel = mongoose.model("Aspect", aspectsSchema);
