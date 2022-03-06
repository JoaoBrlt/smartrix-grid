import { IsDate, IsInt, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class HouseholdMetricsEvent {
  /**
   * The customer's id
   */
  @IsNumber()
  @IsNotEmpty()
  public customerId: number;

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
   * The energy consume from the battery since the last report.
   * Negative if charged.
   */
  @IsNotEmpty({
    message: 'The battery consumption is required. (batteryUsage missing)',
  })
  @IsInt({ message: 'The battery consumption must be an integer value.' })
  public batteryUsage: number;

  /**
   * The energy stored in the battery of the customer at the current date.
   */
  @IsNotEmpty({
    message: 'The battery energy is required. (currentBattery missing)',
  })
  @IsInt({ message: 'The battery energy must be an integer value.' })
  @Min(0, { message: 'The battery energy must be positive or zero.' })
  public currentBattery: number;

  /**
   * The energy limit the battery of the customer can store.
   */
  @IsNotEmpty({
    message: 'The battery limit is required. (maxBattery missing)',
  })
  @IsInt({ message: 'The battery limit must be an integer value.' })
  @Min(0, { message: 'The battery limit must be positive or zero.' })
  public maxBattery: number;

  /**
   * The purchase price of the energy at the time of recording (in € / kWh).
   * Min value : 0.0001 € / kWh
   * Max value : 99.9999 € / kWh
   */
  @IsNumber()
  @IsNotEmpty()
  public purchasePrice: number;

  /**
   * The selling price of the energy at the time of recording (in € / kWh).
   * Min value : 0.0001 € / kWh
   * Max value : 99.9999 € / kWh
   */
  @IsNumber()
  @IsNotEmpty()
  public sellingPrice: number;

  /**
   * The date of the record.
   */
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  public date: Date;

  constructor() {
    this.customerId = 0;
    this.consumption = 0;
    this.boughtConsumption = 0;
    this.production = 0;
    this.purchasePrice = 0;
    this.sellingPrice = 0;
    this.soldProduction = 0;
    this.currentBattery = 0;
    this.maxBattery = 0;
    this.batteryUsage = 0;
  }
}
