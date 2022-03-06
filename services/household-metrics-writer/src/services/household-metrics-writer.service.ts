import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, getRepository, Repository } from 'typeorm';
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli';
import { HouseholdMetrics } from '../entities/household-metrics.entity';
import { ReportHouseholdMetricsDto } from 'src/dtos/report-household-metrics.dto';
import * as path from 'path';
import { ClientKafka } from '@nestjs/microservices';
import { HouseholdMetricsEvent } from '../dtos/household-metrics.event.dto';
import { PriceService } from '../external/price.service';

@Injectable()
export class HouseholdMetricsWriterService implements OnModuleInit, OnModuleDestroy {
  /**
   * Constructs the household metrics writer service.
   * @param householdMetricsRepository The household metrics repository.
   * @param kafkaClient the kafka producer instance
   * @param priceService
   */
  constructor(
    @InjectRepository(HouseholdMetrics)
    private readonly householdMetricsRepository: Repository<HouseholdMetrics>,
    @Inject('KAFKA_CLIENT') private readonly kafkaClient: ClientKafka,
    private readonly priceService: PriceService,
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
   * Stores a household metrics record.
   * @param householdMetricsRequest The household metrics request.
   */
  public async storeHouseholdMetrics(householdMetricsRequest: ReportHouseholdMetricsDto): Promise<void> {
    //Event DTO to be sent into the bus
    const event: HouseholdMetricsEvent = {
      customerId: householdMetricsRequest.customerId,
      consumption: householdMetricsRequest.consumption,
      boughtConsumption: Math.max(
        householdMetricsRequest.consumption - householdMetricsRequest.production - householdMetricsRequest.batteryUsage,
        0,
      ),
      production: householdMetricsRequest.production,
      soldProduction: Math.max(
        householdMetricsRequest.production - householdMetricsRequest.consumption + householdMetricsRequest.batteryUsage,
        0,
      ),
      batteryUsage: householdMetricsRequest.batteryUsage,
      currentBattery: householdMetricsRequest.currentBattery,
      maxBattery: householdMetricsRequest.maxBattery,
      purchasePrice: this.priceService.purchasePrice,
      sellingPrice: this.priceService.sellingPrice,
      date: householdMetricsRequest.date,
    };
    //Entity to save in DB
    const householdMetrics = this.householdMetricsRepository.create(event);
    this.kafkaClient.emit('consumption-metrics', event); //Kafka
    await this.householdMetricsRepository.save(householdMetrics); //DB
  }

  /**
   * Loads the household metric fixtures.
   */
  public async loadFixtures(): Promise<void> {
    try {
      // Get the connection.
      const connection = getConnection();
      const loader = new Loader();
      loader.load(path.resolve('src/fixtures'));

      // Get the fixtures.
      const resolver = new Resolver();
      const fixtures = resolver.resolve(loader.fixtureConfigs);
      const builder = new Builder(connection, new Parser());

      // Load the fixtures.
      for (const fixture of fixturesIterator(fixtures)) {
        const entity = await builder.build(fixture);
        await getRepository(entity.constructor.name).save(entity);
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   * Clears the household metric records.
   */
  public async clear(): Promise<void> {
    await this.householdMetricsRepository.clear();
  }
}
