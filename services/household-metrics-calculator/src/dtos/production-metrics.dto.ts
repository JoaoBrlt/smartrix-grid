import { IsDate, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum ProductionType {
  HOUSEHOLD = 'HOUSEHOLD',
  POWER_PLANT = 'POWER_PLANT',
}

export class ProductionMetrics {
  /**
   * The production (add on the grid) registered
   */
  @IsNotEmpty()
  @IsNumber()
  public production: number;

  /**
   * The type of production (HOUSEHOLD, POWER_PLANT, ...)
   */
  @IsNotEmpty()
  @IsEnum(ProductionType)
  public type: ProductionType;

  /**
   * The date of production of the energy.
   */
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  public date: Date;
}
