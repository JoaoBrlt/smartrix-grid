import { Transport } from '@nestjs/microservices';

export default () => ({
  // Service.
  port: parseInt(process.env.PORT, 10) || 3008,

  // Kafka.
  kafka: {
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: 'local',
        brokers: [process.env.KAFKA_URL || 'localhost:9093'],
      },
      consumer: {
        groupId: 'meter-controller-mock',
      },
    },
  },

  // External services.
  simulationService: {
    host: process.env.SIMULATOR_HOST || 'localhost',
    port: parseInt(process.env.SIMULATOR_PORT, 10) || 3030,
  },
});
