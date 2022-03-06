import { ArrayNotEmpty, IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class ConsumptionByCommunity {
  /**
   * The customer identifier.
   */
  @IsNumber()
  @IsNotEmpty()
  public communityId: number;

  /**
   * The energy consumption of the all community since the last record.
   */
  @IsNumber()
  @IsNotEmpty()
  public amount: number;

  /**
   * The energy consumption of the all community since the last record.
   */
  @IsArray()
  @IsNumber({}, { each: true })
  @ArrayNotEmpty()
  public customersIds: number[];
}
