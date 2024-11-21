import type { IPropertiesSchema } from "core/aspect/aspect.types";
import mongoose from "mongoose";

const propertiesSchema = new mongoose.Schema<IPropertiesSchema>({
	is_damage: { type: Number, required: true },
	is_typed: { type: Number, required: true },
	is_convert: { type: Number, required: true },
	is_percent: { type: Number, required: true },
	is_duration: {
		type: Number,
		required: true,
		validate: {
			validator: function (value: number) {
				// If is_dot is 1, then is_damage must be 1
				return !(value === 1 && (this as IPropertiesSchema).is_damage !== 1);
			},
			message: "If is_dot is 1, then is_damage must be 1",
		},
	},
	is_range: { type: Number, required: true },
	hit_count: { type: Number, required: true },
	cooldown: { type: Number, required: true },
	wait_turns: { type: Number, required: true },
	is_stun: { type: Number, required: true },
	is_slow: { type: Number, required: true },
	is_retaliate: { type: Number, required: true },
	is_silence: { type: Number, required: true },
	is_sleep: { type: Number, required: true },
	is_taunt: { type: Number, required: true },
	is_fear: { type: Number, required: true },
	is_confuse: { type: Number, required: true },
	is_charm: { type: Number, required: true },
	is_heal: { type: Number, required: true },
	is_frenzy: { type: Number, required: true },
});

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
	properties: { type: propertiesSchema, required: true },
});

aspectsSchema.pre("save", async function (next) {
	const aspect = this;

	if (aspect.isNew) {
		if (!aspect.aspect_id) {
			const lastAspect = await mongoose.model("Aspect").findOne().sort({ aspect_id: -1 }).exec();
			aspect.aspect_id = lastAspect ? lastAspect.aspect_id + 1 : 0;
		}
	}

	next();
});

export type AspectModel = mongoose.InferSchemaType<typeof aspectsSchema>;
export const AspectModel = mongoose.model("Aspect", aspectsSchema);
