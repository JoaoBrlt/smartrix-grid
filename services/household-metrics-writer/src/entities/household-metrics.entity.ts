import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class HouseholdMetrics {
  /**
   * The record identifier.
   */
  @PrimaryGeneratedColumn()
  public id: number;

  /**
   * The customer identifier.
   */
  @Column()
  public customerId: number;

  /**
   * The customer energy consumption since the last measurement (in Wh).
   */
  @Column()
  public consumption: number;

  /**
   * The energy consumption purchased by the customer from the grid since the last measurement (in Wh).
   */
  @Column()
  public boughtConsumption: number;

  /**
   * The customer energy production since the last measurement (in Wh).
   */
  @Column()
  public production: number;

  /**
   * The energy consumption sold by the customer to the grid since the last measurement (in Wh).
   */
  @Column()
  public soldProduction: number;

  /**
   * The purchase price of the energy at the time of recording (in € / kWh).
   * Min value : 0.0001 € / kWh
   * Max value : 99.9999 € / kWh
   */
  @Column({
    type: 'decimal',
    precision: 6,
    scale: 4,
  })
  public purchasePrice: number;

  /**
   * The energy consume from the battery since the last report.
   * Negative if charged.
   */
  @Column()
  public batteryUsage: number;

  /**
   * The energy stored in the battery of the customer at the current date.
   */
  @Column()
  public currentBattery: number;

  /**
   * The energy limit the battery of the customer can store.
   */
  @Column()
  public maxBattery: number;

  /**
   * The selling price of the energy at the time of recording (in € / kWh).
   * Min value : 0.0001 € / kWh
   * Max value : 99.9999 € / kWh
   */
  @Column({
    type: 'decimal',
    precision: 6,
    scale: 4,
  })
  public sellingPrice: number;

  /**
   * The date of the record.
   */
  @Column()
  public date: Date;
}
