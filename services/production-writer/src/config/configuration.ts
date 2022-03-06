import { Transport } from '@nestjs/microservices';

export default () => ({
  // Service.
  port: parseInt(process.env.PORT, 10) || 3002,

  // Kafka.
  kafka: {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'local',
        brokers: [process.env.KAFKA_URL || 'localhost:9093'],
      },
      consumer: {
        groupId: 'production-writer',
      },
    },
  },

  // Database.
  database: {
    type: 'postgres',
    url: process.env.DATABASE_URL || 'postgres://soa-e-usr:soa-e-pwd@localhost:6543/soa-e',
    synchronize: true,
    logging: false,
    entities: ['dist/**/*.entity.{js,ts}'],
    subscribers: ['dist/**/*.subscriber.{js,ts}'],
  },
});
