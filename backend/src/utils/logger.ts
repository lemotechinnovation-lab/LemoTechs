import * as winston from 'winston';

const { createLogger, format, transports } = winston;

const LOG_LEVELS = {
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        debug: 3
    }
};

export class Logger {
    private static logger: winston.Logger;
    private static initialized = false;

    public static configure() {
        if (this.initialized) return;
        
        this.logger = createLogger({
            levels: LOG_LEVELS.levels,
            transports: [
                new transports.Console({
                    level: process.env.LOG_LEVEL || "info",
                    format: format.combine(
                        format.timestamp({
                            format: "DD-MMM-YYYY HH:mm:ss"
                        }),
                        format.colorize(),
                        format.printf((data: any) => {
                            const metaString = data.metadata ? ` ${JSON.stringify(data.metadata)}` : "";
                            return `${data.timestamp} [${data.level.toUpperCase()}] ${data.message}${metaString}`;
                        })
                    )
                })
            ]
        });
        
        this.initialized = true;
    }

    public static fatal(message: string, metadata?: any) {
        this.configure();
        this.logger.error({ message, metadata });
    }

    public static error(message: string, metadata?: any) {
        this.configure();
        this.logger.error({ message, metadata });
    }

    public static warn(message: string, metadata?: any) {
        this.configure();
        this.logger.warn({ message, metadata });
    }

    public static info(message: string, metadata?: any) {
        this.configure();
        this.logger.info({ message, metadata });
    }

    public static debug(message: string, metadata?: any) {
        this.configure();
        this.logger.debug({ message, metadata });
    }

    // Convenience methods for common patterns
    public static logError(error: Error, context?: string) {
        this.error(`${context ? context + ': ' : ''}${error.message}`, {
            stack: error.stack,
            name: error.name
        });
    }

    public static logRequest(method: string, url: string, userId?: string) {
        this.info(`${method} ${url}`, { userId });
    }

    public static logResponse(statusCode: number, message: string, userId?: string) {
        this.info(`Response ${statusCode}: ${message}`, { userId });
    }
}

// Initialize logger on import
Logger.configure();
