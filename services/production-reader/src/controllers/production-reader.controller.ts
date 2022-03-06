import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ProductionReaderService } from '../services/production-reader.service';
import { Production } from '../entities/production.entity';

@Controller('/production-reader')
export class ProductionReaderController {
  /**
   * Constructs the production reader controller.
   * @param productionReaderService The production reader service.
   */
  constructor(private readonly productionReaderService: ProductionReaderService) {}

  /**
   * Returns the total production.
   */
  @Get('total-production')
  public getTotalProduction(): Promise<number> {
    return this.productionReaderService.getTotalProduction();
  }

  /**
   * Gives the amount of total production for today (or the given date).
   * @param dateString (optional)
   */
  @Get('total-production/today')
  public getConsumptionForToday(@Query('date') dateString: string): Promise<number[]> {
    return this.productionReaderService.getGivenDayTotalProduction(
      ProductionReaderController.dateFromString(dateString),
    );
  }

  /**
   * Gives the amount of the last production of the given date.
   * @param dateString (optional)
   */
  @Get('total-production/last')
  public getLastConsumption(@Query('date') dateString: string): Promise<Production> {
    return this.productionReaderService.getLastProduction(ProductionReaderController.dateFromString(dateString));
  }

  /**
   * Gives the amount of total production for a given day.
   * @param dateString the given day to get the total production (yyyy-MM-dd)
   */
  @Get('total-production/days/:day')
  public getGivenDayTotalProduction(@Query('day') dateString: string): Promise<number[]> {
    return this.productionReaderService.getGivenDayTotalProduction(
      ProductionReaderController.dateFromString(dateString),
    );
  }

  /**
   * Gives the amount of total production for a given month
   * @param dateString the given month to get the total production (yyyy-MM)
   */
  @Get('total-production/months/:month')
  public async getGivenMonthTotalProduction(@Param('month') dateString: string): Promise<number> {
    return this.productionReaderService.getGivenMonthTotalProduction(
      ProductionReaderController.dateFromString(dateString),
    );
  }

  /**
   * Gives the amount of total production for a given year
   * @param dateString the given year to get the total production (yyyy)
   */
  @Get('total-production/years/:year')
  public async getGivenYearTotalProduction(@Query('year') dateString: string): Promise<number> {
    return this.productionReaderService.getGivenYearTotalProduction(
      ProductionReaderController.dateFromString(dateString),
    );
  }

  /**
   * Returns a production by identifier.
   * @param id The production identifier.
   */
  @Get(':id')
  public getProductionById(@Param('id', ParseIntPipe) id: number): Promise<Production> {
    return this.productionReaderService.getProductionById(id);
  }

  /**
   * Converts a well formatted string into its related Date object.
   * @param dateString the string date used - if null: Date.now()
   * @private
   */
  private static dateFromString(dateString: string): Date {
    return dateString ? new Date(Date.parse(dateString)) : new Date();
  }
}
