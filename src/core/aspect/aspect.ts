import type { Dto, Serializable } from "common/dto";
import crypto from "crypto";
import type { AspectCreationData, IAspectProperties } from "./aspect.types";
import AspectProperties from "./aspectProperties";

class Aspect implements Serializable<Aspect> {
	private aspect_id?: number;
	private hash?: string;
	private tier: number;
	private weight: number;
	private potency: number;
	private rune_ids: number[];
	private required_rune_ids: number[];
	private blocked_aspect_ids: number[];
	private properties: AspectProperties;

	constructor(data: AspectCreationData) {
		this.tier = data.tier;
		this.weight = data.weight;
		this.potency = data.potency;
		this.rune_ids = data.rune_ids;
		this.required_rune_ids = data.required_rune_ids;
		this.blocked_aspect_ids = data.blocked_aspect_ids;
		this.properties = new AspectProperties(data.properties);
		this.getHashCode();
	}

	public setAspectId(aspect_id: number) {
		this.aspect_id = aspect_id;
	}

	public getAspectId() {
		return this.aspect_id;
	}

	public getHashCode() {
		if (!this.hash) {
			const hash = crypto.createHash("sha256");

			// Concatenate all properties into a single string
			const dataString = [
				...(this.aspect_id ? [this.aspect_id] : []), // Only include aspect_id if it exists
				this.tier,
				this.weight,
				this.potency,
				this.rune_ids.join(","), // Join array elements with a comma
				this.required_rune_ids.join(","),
				this.blocked_aspect_ids.join(","),
				// Convert properties object to an array of key-value pairs, then join them with a comma
				...Object.entries(this.properties).map(([key, value]) => `${key}=${value}`),
			].join("|"); // Use a delimiter that won't appear in the data

			// Generate the hash from the concatenated string
			hash.update(dataString);
			this.hash = hash.digest("hex");
		}
		return this.hash;
	}

	serialize(): Dto<Aspect> {
		return { ...this, properties: this.properties.serialize() };
	}
}
export default Aspect;
