import { LogModel, LogLevel } from "../models/logs.model";
import type { FilterQuery } from "mongoose";

export interface ILogQuery {
    startDate?: Date;
    endDate?: Date;
    level?: LogLevel;
    source?: string;
    messageContains?: string;
    limit?: number;
    skip?: number;
}

export class LogRepository {
    async create(level: LogLevel, message: string, metadata?: Record<string, any>, source?: string, stack?: string) {
        const log = new LogModel({
            level,
            message,
            metadata: metadata ? new Map(Object.entries(metadata)) : undefined,
            source,
            stack
        });
        
        return await log.save();
    }

    async createMany(logs: Array<{ level: LogLevel; message: string; metadata?: Record<string, any>; source?: string; stack?: string; }>) {
        const documents = logs.map(log => ({
            ...log,
            metadata: log.metadata ? new Map(Object.entries(log.metadata)) : undefined,
            timestamp: new Date()
        }));
        
        return await LogModel.insertMany(documents);
    }

    async findByLevel(level: LogLevel, limit = 100) {
        return await LogModel.find({ level })
            .sort({ timestamp: -1 })
            .limit(limit)
            .exec();
    }

    async findByTimeRange(startDate: Date, endDate: Date, level?: LogLevel) {
        const query: FilterQuery<typeof LogModel> = {
            timestamp: {
                $gte: startDate,
                $lte: endDate
            }
        };

        if (level) {
            query.level = level;
        }

        return await LogModel.find(query)
            .sort({ timestamp: -1 })
            .exec();
    }

    async search(params: ILogQuery) {
        const query: FilterQuery<typeof LogModel> = {};
        
        if (params.startDate || params.endDate) {
            query.timestamp = {};
            if (params.startDate) query.timestamp.$gte = params.startDate;
            if (params.endDate) query.timestamp.$lte = params.endDate;
        }
        
        if (params.level) {
            query.level = params.level;
        }
        
        if (params.source) {
            query.source = { $regex: params.source, $options: 'i' };
        }
        
        if (params.messageContains) {
            query.message = { $regex: params.messageContains, $options: 'i' };
        }

        const findQuery = LogModel.find(query)
            .sort({ timestamp: -1 });
            
        if (params.skip) {
            findQuery.skip(params.skip);
        }
        
        if (params.limit) {
            findQuery.limit(params.limit);
        }

        return await findQuery.exec();
    }

    async clearOlderThan(date: Date) {
        return await LogModel.deleteMany({
            timestamp: { $lt: date }
        });
    }

    async getLogStats(startDate: Date, endDate: Date) {
        return await LogModel.aggregate([
            {
                $match: {
                    timestamp: {
                        $gte: startDate,
                        $lte: endDate
                    }
                }
            },
            {
                $group: {
                    _id: "$level",
                    count: { $sum: 1 },
                    averageMetadataSize: { 
                        $avg: { 
                            $size: { $objectToArray: "$metadata" } 
                        } 
                    }
                }
            }
        ]);
    }

    async findBySource(source: string, limit = 100) {
        return await LogModel.find({ 
            source: { $regex: source, $options: 'i' } 
        })
        .sort({ timestamp: -1 })
        .limit(limit)
        .exec();
    }
} 