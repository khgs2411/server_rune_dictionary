import mongoose from "mongoose";
import { IStats, statsSchemaDefinition } from "./definitions/stats";

const characterSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    stats: {
        type: statsSchemaDefinition,
        required: true
    },
    baseStats: {
        type: statsSchemaDefinition,
        required: false
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


// Define interface for methods
interface ICharacterMethods {
    levelUp(stats?: Partial<IStats>): this;
}


// Add any methods or virtuals here
characterSchema.methods.levelUp = function (stats?: Partial<IStats>) {
    const self = this as CharacterModel;

    self.level += 1;

    if (stats) {
        (Object.keys(stats) as Array<keyof IStats>).forEach(key => {
            if (key in this.stats) {
                this.stats[key] = stats[key]!;
            }
        });
    } else {
        self.stats.maxHealth += 10;
        self.stats.health = self.stats.maxHealth
    }

    return self;
};

// Export with proper typing

interface ICharacterData {
    stats: IStats;
    baseStats?: IStats;
}

export interface ICharacterShape extends ICharacterData {
    name: string;
    level: number;
}

type CharacterDefinition = ICharacterData & ICharacterMethods
type CharacterModelType = Omit<mongoose.InferSchemaType<typeof characterSchema>, 'stats' | 'baseStats'> & CharacterDefinition;


export type CharacterModel = mongoose.HydratedDocument<CharacterModelType>;

export const CharacterModel = mongoose.model<CharacterModel>("Character", characterSchema);