import mongoose from "mongoose";

export enum LogLevel {
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    DEBUG = "debug"
}

const logsSchema = new mongoose.Schema({
    timestamp: { 
        type: Date, 
        required: true,
        default: Date.now 
    },
    level: { 
        type: String, 
        required: true,
        enum: Object.values(LogLevel)
    },
    message: { 
        type: String, 
        required: true 
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: new Map()
    },
    source: {
        type: String,
        required: false
    },
    stack: {
        type: String,
        required: false
    }
}, {
    timestamps: true // Adds createdAt and updatedAt
});

// Index for better query performance
logsSchema.index({ timestamp: -1 });
logsSchema.index({ level: 1 });

export type LogModel = mongoose.InferSchemaType<typeof logsSchema>;
export const LogModel = mongoose.model("Log", logsSchema);
