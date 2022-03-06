import { Injectable } from '@nestjs/common';
import { getConnection, getRepository, LessThanOrEqual, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceDto } from '../dtos/price-estimator.dto';
import { Price } from '../entities/price-estimator.entity';
import * as path from 'path';
import { Builder, fixturesIterator, Loader, Parser, Resolver } from 'typeorm-fixtures-cli';
import { ProducerService } from '../external/producer-service';

@Injectable()
export class PriceEstimatorService {
  /**
   * Constructs the price estimator service.
   * @param priceEstimatorRepository
   * @param producerService kafka producer service
   */
  constructor(
    @InjectRepository(Price)
    private readonly priceEstimatorRepository: Repository<Price>,
    private readonly producerService: ProducerService,
  ) {}

  /**
   * Store the newest price to use => The one to retrieve when asked.
   * Emit to the bus FIRST (faster), then after write it to the DB
   * @param priceRequest the new price to store, will become the latest
   */
  public async storeNewestPrice(priceRequest: PriceDto) {
    const price = this.priceEstimatorRepository.create({
      price: priceRequest.price,
      date: new Date(), //Each time we store the price, it has to be the newest, so the date is set to now!
    });
    //Send it to the bus (emit, no answer expected)
    this.producerService.emitNewPrice(price);

    //Save it to the DB
    await this.priceEstimatorRepository.save(price);
  }

  /**
   * Return the latest price stored. Sort dates by descending
   */
  public async getLatestPrice(): Promise<Price> {
    return await this.priceEstimatorRepository.findOne({ order: { date: 'DESC' } });
  }

  /**
   * Returns the price for a fixed date (== the closest one, descending)
   * @param date This date should be greater or equal than the corresponding price's date in DB
   */
  public async getPriceByDate(date: Date): Promise<Price | undefined> {
    return this.priceEstimatorRepository.findOne({
      where: {
        date: LessThanOrEqual(date),
      },
      order: {
        date: 'DESC',
      },
    });
  }

  /**
   * Loads the fixtures to fill the database.
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
   * Clears the entities.
   */
  public async clear() {
    await this.priceEstimatorRepository.clear();
  }
}
