import { Transport } from '@nestjs/microservices';

export default () => ({
  // Service.
  port: parseInt(process.env.PORT, 10) || 3001,

  // Kafka.
  kafka: {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'local',
        brokers: [process.env.KAFKA_URL || 'localhost:9093'],
      },
      consumer: {
        groupId: 'consumption-notifier',
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

  // Mail server.
  mailServer: {
    host: process.env.MAIL_SERVER_HOST || 'localhost',
    port: parseInt(process.env.MAIL_SERVER_PORT, 10) || 4000,
  },
});
