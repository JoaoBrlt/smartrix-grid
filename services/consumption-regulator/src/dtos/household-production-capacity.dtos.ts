import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class HouseholdProductionCapacity {
  /**
   * The record identifier.
   */
  @IsNumber()
  public id: number;

  /**
   * The customer identifier.
   */
  @IsNumber()
  @IsNotEmpty()
  public customerId: number;

  /**
   * The energy that the household could potentially produce (in Wh).
   */
  @IsNumber()
  @IsNotEmpty()
  public amount: number;

  /**
   * The date of sampling.
   */
  @IsDate()
  @Type(() => Date)
  public date: Date;
}
