export class HouseholdMetricsDto {
  /**
   * The customer energy consumption since the last measurement (in Wh).
   */
  public consumption: number;

  /**
   * The energy consumption purchased by the customer from the grid since the last measurement (in Wh).
   */
  public boughtConsumption: number;

  /**
   * The customer energy production since the last measurement (in Wh).
   */
  public production: number;

  /**
   * The energy consumption sold by the customer to the grid since the last measurement (in Wh).
   */
  public soldProduction: number;

  /**
   * The amount to be invoiced or credited to the customer (in €).
   * If the amount is positive, it is the amount to be invoiced to the customer.
   * On the contrary, if the amount is negative, it is the amount to be credited to the customer.
   */
  public amount: number;

  /**
   * The energy consume from the battery since the last measurement.
   * Negative if charged.
   */
  public batteryUsage: number;

  /**
   * The energy stored in the battery of the customer at the current date.
   */
  public currentBattery: number;

  /**
   * The energy limit the battery of the customer can store.
   */
  public maxBattery: number;

  /**
   * The date of the record.
   */
  public date?: Date;
}
