import { Kafka } from 'kafkajs';

export const KafkaProvider = {
    provide: 'KafkaServer',
    useFactory: () => {
        return new Kafka({
            clientId: 'hero',
            brokers: ['kafka1:9092', 'kafka2:9092'],
        });
    }
}