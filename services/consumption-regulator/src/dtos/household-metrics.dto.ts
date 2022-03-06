import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class HouseholdMetricsDto {
  /**
   * The customer energy consumption since the last measurement (in Wh).
   */
  @IsNumber()
  @IsNotEmpty()
  public consumption: number;

  /**
   * The energy consumption purchased by the customer from the grid since the last measurement (in Wh).
   */
  @IsNumber()
  @IsNotEmpty()
  public boughtConsumption: number;

  /**
   * The customer energy production since the last measurement (in Wh).
   */
  @IsNumber()
  @IsNotEmpty()
  public production: number;

  /**
   * The energy consumption sold by the customer to the grid since the last measurement (in Wh).
   */
  @IsNumber()
  @IsNotEmpty()
  public soldProduction: number;

  /**
   * The amount to be invoiced or credited to the customer (in €).
   * If the amount is positive, it is the amount to be invoiced to the customer.
   * On the contrary, if the amount is negative, it is the amount to be credited to the customer.
   */
  @IsNumber()
  @IsNotEmpty()
  public amount: number;

  /**
   * The date of the record.
   */
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  public date: Date;
}
