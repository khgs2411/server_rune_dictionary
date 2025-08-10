// Define the stats interface for TypeScript
export interface IStats {
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  special_attack: number;
  special_defense: number;
  speed: number;
  tempo: number;
}

// Create reusable schema definition from interface
export const statsSchemaDefinition: Record<
  keyof IStats,
  { type: any; required: boolean; default: number }
> = {
  health: { type: Number, required: true, default: 50 },
  maxHealth: { type: Number, required: true, default: 50 },
  attack: { type: Number, required: true, default: 40 },
  defense: { type: Number, required: true, default: 40 },
  special_attack: { type: Number, required: true, default: 40 },
  special_defense: { type: Number, required: true, default: 40 },
  speed: { type: Number, required: true, default: 40 },
  tempo: { type: Number, required: true, default: 100 }, // Neutral tempo
};
