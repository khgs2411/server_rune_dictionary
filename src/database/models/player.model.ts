import mongoose from "mongoose";
import { IStats, statsSchemaDefinition } from "./definitions/stats";

const playerSchema = new mongoose.Schema({
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
interface IPlayerMethods {
    levelUp(stats?: Partial<IStats>): this;
}


// Add any methods or virtuals here
playerSchema.methods.levelUp = function (stats?: Partial<IStats>) {
    const self = this as PlayerModel;

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

interface IPlayerData {
    stats: IStats;
    baseStats?: IStats;
}

type PlayerDefinition = IPlayerData & IPlayerMethods
type PlayerModelType = Omit<mongoose.InferSchemaType<typeof playerSchema>, 'stats' | 'baseStats'> & PlayerDefinition;


export type PlayerModel = mongoose.HydratedDocument<PlayerModelType>;

export const PlayerModel = mongoose.model<PlayerModel>("Player", playerSchema);