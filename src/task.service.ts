import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression, SchedulerRegistry } from "@nestjs/schedule";
import { CronJob } from 'cron';

@Injectable()
export class TaskService {
    constructor(private schedulerRegistry: SchedulerRegistry) { }
    private readonly logger = new Logger(TaskService.name);

    @Cron(CronExpression.EVERY_12_HOURS)
    handlerCron() {
        this.logger.debug('Called every 12 hours');
    }

    addCronJob(name: string, seconds: number) {
        const job = new CronJob(`${seconds} * * * * *`, () => {
            this.logger.debug(`time ${seconds} for job ${name} to run!`);
        });
        this.schedulerRegistry.addCronJob(name, job);
        job.start();

        this.logger.warn(
            `job ${name} added for each minute at ${seconds} seconds!`,
        );
    }

    getCronJob(name: string) {
        return this.schedulerRegistry.getCronJob(name);
    }

    deleteCronJob(name: string) {
        this.schedulerRegistry.deleteCronJob(name);
    }
}