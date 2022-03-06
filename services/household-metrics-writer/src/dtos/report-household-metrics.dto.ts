import { IsDate, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class ReportHouseholdMetricsDto {
  /**
   * The customer identifier.
   */
  @IsNotEmpty({ message: 'The customer identifier is required.' })
  @IsInt({ message: 'The customer identifier must be an integer value.' })
  public customerId: number;

  /**
   * The customer energy consumption since the last measurement (in Wh).
   */
  @IsNotEmpty({ message: 'The consumption is required.' })
  @IsInt({ message: 'The consumption must be an integer value.' })
  @Min(0, { message: 'The consumption must be positive or zero.' })
  public consumption: number;

  /**
   * The customer energy production since the last measurement (in Wh).
   */
  @IsNotEmpty({ message: 'The production is required.' })
  @IsInt({ message: 'The production must be an integer value.' })
  @Min(0, { message: 'The production must be positive or zero.' })
  public production: number;

  /**
   * The energy consume from the battery since the last report.
   * Negative if charged.
   */
  @IsNotEmpty({ message: 'The battery consumption is required. (batteryUsage missing)' })
  @IsInt({ message: 'The battery consumption must be an integer value.' })
  public batteryUsage: number;

  /**
   * The energy stored in the battery of the customer at the current date.
   */
  @IsNotEmpty({ message: 'The battery energy is required. (currentBattery missing)' })
  @IsInt({ message: 'The battery energy must be an integer value.' })
  @Min(0, { message: 'The battery energy must be positive or zero.' })
  public currentBattery: number;

  /**
   * The energy limit the battery of the customer can store.
   */
  @IsNotEmpty({ message: 'The battery limit is required. (maxBattery missing)' })
  @IsInt({ message: 'The battery limit must be an integer value.' })
  @Min(0, { message: 'The battery limit must be positive or zero.' })
  public maxBattery: number;

  /**
   * The date of collection of the measurement.
   */
  @IsOptional()
  @IsDate({ message: 'The date must be a valid ISO 8601 date string.' })
  @Type(() => Date)
  public date: Date;
}
