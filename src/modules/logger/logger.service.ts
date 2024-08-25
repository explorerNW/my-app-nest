import { ConsoleLogger, Injectable } from "@nestjs/common";

@Injectable()
export class LoggerService extends ConsoleLogger {
    
    debug(message: any, stack?: string, context?: string) {
        super.debug(message, ...arguments);
    }

    warn(message: any, stack?: string, context?: string) {
        super.warn(message, ...arguments);
    }

    error(message: any, stack?: string, context?: string) {
        super.error(message, ...arguments);
    }

}