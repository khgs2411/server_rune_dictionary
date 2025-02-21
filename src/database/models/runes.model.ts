import mongoose from "mongoose";

const runesSchema = new mongoose.Schema({
	rune_id: { type: Number, required: false, unique: true }, //? auto increment
	name: { type: String, required: true, unique: true },
	weight: { type: Number, required: true },
	type: { type: Number, required: false },
});

runesSchema.pre("save", async function (next: () => void) {
	const rune = this;

	if (rune.isNew) {
		// Get the current highest rune_id and increment it
		const lastRune = await mongoose.model("Rune").findOne().sort({ rune_id: -1 }).exec();
		rune.rune_id = lastRune ? lastRune.rune_id + 1 : 0;
	}

	next();
});

export type RuneModel = mongoose.InferSchemaType<typeof runesSchema>;
export const RuneModel = mongoose.model("Rune", runesSchema);
