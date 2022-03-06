import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PriceEstimatorService } from '../services/price-estimator.service';
import { PriceDto } from '../dtos/price-estimator.dto';
import { PriceDateDto } from '../dtos/price-date.dto';

@Controller('price-estimator')
export class PriceEstimatorController {
  /**
   * Constructs the price estimator controller.
   * @param priceEstimatorService
   */
  constructor(private readonly priceEstimatorService: PriceEstimatorService) {}

  /**
   * Store the newest price to use.
   * @param priceRequest the latest price to store
   */
  @Post()
  public async storeNewestPrice(@Body() priceRequest: PriceDto) {
    await this.priceEstimatorService.storeNewestPrice(priceRequest);
  }

  /**
   * Get the latest price stored in the DB, to be used by other services
   * GET => No Path (default route)
   * WARN : Naively, this method wont throw any errors if the BD is empty !
   *        => For this request, I consider the DB to be filled (fixtures)
   */
  @Get()
  public async getLatestPrice() {
    return await this.priceEstimatorService.getLatestPrice();
  }

  /**
   * Get the price stored in the DB that correspond the closest to the date given in parameter
   * This method throws a 400: Bad Request if the service returns undefined, means the date is incorrect (too low)
   * @param dateQuery the DTO containing only the date => goes under validation
   */
  @Get('/by-date')
  public async getPriceByDate(@Query() dateQuery: PriceDateDto) {
    const price = await this.priceEstimatorService.getPriceByDate(dateQuery.date);
    if (!price) throw new BadRequestException(); //Check if something is returned (if price is undefined then throw exc)
    return price;
  }

  /**
   * Loads the prices fixtures.
   */
  @Get('fixtures')
  public async loadFixtures() {
    await this.priceEstimatorService.loadFixtures();
  }

  /**
   * Clears the entities.
   */
  @Get('/clear')
  public async clear() {
    await this.priceEstimatorService.clear();
  }
}
