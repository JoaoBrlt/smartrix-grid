import { Transport } from '@nestjs/microservices';

export default () => ({
  // Service.
  port: parseInt(process.env.PORT, 10) || 3012,

  // Kafka.
  kafka: {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'local',
        brokers: [process.env.KAFKA_URL || 'localhost:9093'],
      },
      consumer: {
        groupId: 'household-metrics-calculator',
      },
    },
  },

  // External services.
  communityManager: {
    host: process.env.COMMUNITY_MANAGER_HOST || 'localhost',
    port: parseInt(process.env.COMMUNITY_MANAGER_PORT, 10) || 3006,
  },
});
