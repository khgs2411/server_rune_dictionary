// Define the stats interface for TypeScript
export interface IStats {
    health: number;
    maxHealth: number;
}

// Create reusable schema definition from interface
export const statsSchemaDefinition: Record<keyof IStats, { type: any, required: boolean, default: number }> = {
    health: { type: Number, required: true, default: 10 },
    maxHealth: { type: Number, required: true, default: 10 },
};