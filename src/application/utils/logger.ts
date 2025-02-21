import { LogLevel } from "../../database/models/logs.model";
import { LogRepository, type ILogQuery } from "../../database/repositories/logs.repository";
import Singleton from "../../base/singleton";

export interface ILogger {
    info(message: string, metadata?: Record<string, any>): Promise<void>;
    warn(message: string, metadata?: Record<string, any>): Promise<void>;
    error(message: string, metadata?: Record<string, any>): Promise<void>;
    debug(message: string, metadata?: Record<string, any>): Promise<void>;
}

export class Logger extends Singleton implements ILogger {
    private repository: LogRepository;
    private static defaultMetadata: Record<string, any> = {};

    private constructor() {
        super();
        this.repository = new LogRepository();
    }

    public static override GetInstance(): Logger {
        return super.GetInstance() as Logger;
    }

    public static setDefaultMetadata(metadata: Record<string, any>) {
        Logger.defaultMetadata = metadata;
    }

    public static addDefaultMetadata(key: string, value: any) {
        Logger.defaultMetadata[key] = value;
    }

    private getCallerInfo(): { source: string, stack?: string } {
        const error = new Error();
        const stack = error.stack?.split('\n');
        // Remove the first two lines (Error and getCallerInfo)
        const caller = stack?.[3]?.trim() || '';
        const match = caller.match(/at\s+(.*)\s+\((.*):(\d+):(\d+)\)/);
        
        return {
            source: match ? `${match[1]} (${match[2]}:${match[3]})` : caller,
            stack: error.stack
        };
    }

    private async log(level: LogLevel, message: string, metadata?: Record<string, any>) {
        const { source, stack } = this.getCallerInfo();
        const combinedMetadata = {
            ...Logger.defaultMetadata,
            ...metadata
        };
        await this.repository.create(level, message, combinedMetadata, source, stack);
    }

    public async info(message: string, metadata?: Record<string, any>) {
        await this.log(LogLevel.INFO, message, metadata);
    }

    public async warn(message: string, metadata?: Record<string, any>) {
        await this.log(LogLevel.WARN, message, metadata);
    }

    public async error(message: string, metadata?: Record<string, any>) {
        await this.log(LogLevel.ERROR, message, metadata);
    }

    public async debug(message: string, metadata?: Record<string, any>) {
        await this.log(LogLevel.DEBUG, message, metadata);
    }

    public async bulkLog(logs: Array<{ level: LogLevel; message: string; metadata?: Record<string, any> }>) {
        const { source, stack } = this.getCallerInfo();
        const logsWithSource = logs.map(log => ({
            ...log,
            metadata: {
                ...Logger.defaultMetadata,
                ...log.metadata
            },
            source,
            stack
        }));
        return await this.repository.createMany(logsWithSource);
    }

    public async getRecentLogs(level?: LogLevel, limit = 100) {
        if (level) {
            return await this.repository.findByLevel(level, limit);
        }
        return await this.repository.findByTimeRange(
            new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
            new Date(),
            level
        );
    }

    public async search(query: ILogQuery) {
        return await this.repository.search(query);
    }

    public async getLogStats(days = 7) {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        return await this.repository.getLogStats(startDate, endDate);
    }

    public async clearOldLogs(daysToKeep = 30) {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
        return await this.repository.clearOlderThan(cutoffDate);
    }

    public async findBySource(source: string, limit = 100) {
        return await this.repository.findBySource(source, limit);
    }
} 