import { HydratedDocument, InferSchemaType, Schema, model } from "mongoose";


export enum LogLevel {
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    DEBUG = "debug"
}

const logsSchema = new Schema({
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
        of: Schema.Types.Mixed,
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

type LogModelType = InferSchemaType<typeof logsSchema>;
export type LogModel = HydratedDocument<LogModelType>;
export const LogModel = model("Log", logsSchema);
