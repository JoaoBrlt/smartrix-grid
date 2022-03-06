import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class HouseholdMetricsDto {
  /**
   * The customer energy consumption since the last measurement (in Wh).
   */
  @IsNotEmpty()
  @IsNumber()
  public consumption: number;

  /**
   * The energy consumption purchased by the customer from the grid since the last measurement (in Wh).
   */
  @IsNotEmpty()
  @IsNumber()
  public boughtConsumption: number;

  /**
   * The customer energy production since the last measurement (in Wh).
   */
  @IsNotEmpty()
  @IsNumber()
  public production: number;

  /**
   * The energy consumption sold by the customer to the grid since the last measurement (in Wh).
   */
  @IsNotEmpty()
  @IsNumber()
  public soldProduction: number;

  /**
   * The amount to be invoiced or credited to the customer (in €).
   * If the amount is positive, it is the amount to be invoiced to the customer.
   * On the contrary, if the amount is negative, it is the amount to be credited to the customer.
   */
  @IsNotEmpty()
  @IsNumber()
  public amount: number;

  /**
   * The date of the record.
   */
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  public date?: Date;
}
