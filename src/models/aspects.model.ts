import mongoose from "mongoose";
const aspectsSchema = new mongoose.Schema({
	hash: { type: String, required: true, unique: true },
	aspect_id: { type: Number, required: false, unique: true }, //? auto increment
	tier: { type: Number, required: true },
	weight: { type: Number, required: true },
	potency: { type: Number, required: true },
	rune_ids: {
		type: [Number],
		required: true,
		validate: {
			validator: function (v: number[]) {
				return v.length > 0;
			},
			message: "rune_ids cannot be an empty array",
		},
	},
	required_rune_ids: { type: [Number], required: true },
	blocked_aspect_ids: { type: [Number], required: true },
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
		if (!aspect.aspect_id) {
			console.log("hook: aspect.isNew && !aspect.aspect_id", aspect.isNew && !aspect.aspect_id);
			// Get the current highest aspect_id and increment it
			const lastAspect = await mongoose.model("Aspect").findOne().sort({ aspect_id: -1 }).exec();
			aspect.aspect_id = lastAspect ? lastAspect.aspect_id + 1 : 0;
		}
	}

	next();
});

export type AspectModel = mongoose.InferSchemaType<typeof aspectsSchema>;
export const AspectModel = mongoose.model("Aspect", aspectsSchema);
