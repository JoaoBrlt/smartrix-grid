import { Community } from './community.dto';
import { IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CommunityMetricsSumEvent {
  /**
   * The id of the community
   */
  @IsNotEmpty()
  public community: Community;

  /**
   * The total energy consumption of the all community since the last measurement (in Wh).
   */
  @IsNumber()
  @IsNotEmpty()
  public totalConsumption: number;

  /**
   * The total energy consumption purchased by customers of the community from the grid
   * since the last measurement (in Wh).
   */
  @IsNumber()
  @IsNotEmpty()
  public totalBoughtConsumption: number;

  /**
   * The total energy production of the all community since the last measurement (in Wh).
   */
  @IsNumber()
  @IsNotEmpty()
  public totalProduction: number;

  /**
   * The energy consumption sold by a customer of the community to the grid since the last measurement (in Wh).
   */
  @IsNumber()
  @IsNotEmpty()
  public totalSoldProduction: number;

  /**
   * The energy consume from all the battery of the community since the last report.
   * Negative if charged.
   */
  @IsNotEmpty()
  @IsInt()
  public totalBatteryUsage: number;

  /**
   * The energy stored in all battery of the community at the current date.
   */
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  public totalCurrentBattery: number;

  /**
   * The energy limit that all battery of the community can store in total.
   */
  @IsNotEmpty()
  @IsInt()
  @Min(0)
  public totalMaxBattery: number;

  /**
   * The last date of all metrics.
   */
  @IsDate()
  @Type(() => Date)
  public date: Date;
}
