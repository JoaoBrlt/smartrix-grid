import { IsDate, IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class ProductionMetrics {
  /**
   * The production (add on the grid) registered
   */
  @IsNotEmpty()
  @IsNumber()
  public amount: number;

  /**
   * The date of production of the energy.
   */
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  public date: Date;
}
