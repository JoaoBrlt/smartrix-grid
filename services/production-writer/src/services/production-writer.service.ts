import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Production } from '../entities/production.entity';
import { ProductionMetrics } from '../dtos/production-metrics.dto';
import { ClientKafka } from '@nestjs/microservices';
import { ProductionMetricsEvent, ProductionType } from '../dtos/production-metrics.event.dto';

@Injectable()
export class ProductionWriterService implements OnModuleInit, OnModuleDestroy {
  /**
   * Constructs the production writer service.
   * @param productionRepository The production repository.
   * @param kafkaClient The kafka client.
   */
  constructor(
    @InjectRepository(Production)
    private productionRepository: Repository<Production>,
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
  ) {}

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
   * Stores a production record.
   * @param productionRequest The production request.
   */
  public async storeProductionRecord(productionRequest: ProductionMetrics): Promise<void> {
    this.kafkaClient.emit('production-metrics', {
      production: productionRequest.amount,
      type: ProductionType.POWER_PLANT,
      date: productionRequest.date || new Date(),
    } as ProductionMetricsEvent); //Emit message to bus

    const production = this.productionRepository.create(productionRequest); //Create Entity
    await this.productionRepository.save(production); //Save it to the DB
  }

  /**
   * Clears the entities.
   */
  public async clear() {
    await this.productionRepository.clear();
  }
}
