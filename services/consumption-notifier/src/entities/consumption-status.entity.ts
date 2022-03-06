import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ConsumptionStatus {
  /**
   * The customer identifier.
   */
  @PrimaryColumn()
  public customerId: number;

  /**
   * Whether the customer is in autarky.
   */
  @Column()
  public autarky: boolean;

  /**
   * The date of the last status change.
   */
  @Column()
  public date: Date;
}
