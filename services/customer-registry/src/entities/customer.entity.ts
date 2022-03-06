import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Customer {
  /**
   * The customer identifier.
   */
  @PrimaryGeneratedColumn()
  public id: number;

  /**
   * The name of the customer.
   */
  @Column()
  public name: string;

  /**
   * The customer payment info.
   */
  @Column()
  public paymentInfo: string;

  /**
   * The customer address.
   */
  @Column()
  public address: string;
}
