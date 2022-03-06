import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Invoice {
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
   * The total purchase price of energy since the last invoice of the customer (in €).
   * If the amount is positive, it is the amount to be invoiced to the customer.
   * On the contrary, if the amount is negative, it is the amount to be credited to the customer.
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 4,
  })
  public amount: number;

  /**
   * The invoice start date.
   */
  @Column()
  public firstDate: Date;

  /**
   * The invoice end date.
   */
  @Column()
  public lastDate: Date;
}
