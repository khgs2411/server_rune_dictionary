import { HydratedDocument, InferSchemaType, Schema, model } from "mongoose";


const runesSchema = new Schema({
	rune_id: { type: Number, required: false, unique: true }, //? auto increment
	name: { type: String, required: true, unique: true },
	weight: { type: Number, required: true },
	type: { type: Number, required: false },
});

runesSchema.pre("save", async function (next: () => void) {
	const rune = this;

	if (rune.isNew) {
		// Get the current highest rune_id and increment it
		const lastRune = await model("Rune").findOne().sort({ rune_id: -1 }).exec();
		rune.rune_id = lastRune ? lastRune.rune_id + 1 : 0;
	}

	next();
});

type RuneModelType = InferSchemaType<typeof runesSchema>;
export type RuneModel = HydratedDocument<RuneModelType>;
export const RuneModel = model("Rune", runesSchema);
