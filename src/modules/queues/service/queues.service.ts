import { OnQueueActive, Process } from '@nestjs/bull';
import { InjectQueue, Processor } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Job } from 'bull';
import { Queue } from 'bullmq';

@Injectable()
export class QueuesService {
    constructor(@InjectQueue('video') private videoQueue: Queue) { }

    async add(name: string, data: any) {
        await this.videoQueue.add(name, data, { lifo: true });
    }
}


@Processor('video')
export class VideoConsumer {
    @OnQueueActive()
    onActive(job: Job) {
        console.log(`Processing job ${job.id} of type ${job.name} with data ${job.data}...`,);
    }

    @Process()
    async process(job: Job) {
        job.data

        await job.progress();
    }
}
