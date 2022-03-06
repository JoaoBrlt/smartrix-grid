import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { MetersIndicationDto } from '../dtos/meters-indication.dto';

@Injectable()
export class ProducerService implements OnModuleInit, OnModuleDestroy {
  /**
   * Constructs the kafka-producer service for the consumption-regulator
   * @param kafkaClient The Kafka client.
   */
  constructor(@Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka) {}

  /**
   * Triggered when the module is initialized.
   */
  public async onModuleInit(): Promise<void> {
    await this.kafkaClient.connect();
  }

  /**
   * Triggered when the module is destroyed.
   */
  public async onModuleDestroy(): Promise<void> {
    await this.kafkaClient.close();
  }

  /**
   * Emit a new directive for the meter controller (Emit message to the bus, without waiting for an answer)
   * Meter-controller will have a consumer listening, and will react instantly when he sees a message in the topic
   */
  public emitNewDirective(dto: MetersIndicationDto) {
    this.kafkaClient.emit('meter-directives', { ...dto });
    // { ...dto } => Gonna auto-stringify the content of the object 'dto', and ONLY the content
    // Result in the message.value = { "communityId": 1, etc... }
  }
}
