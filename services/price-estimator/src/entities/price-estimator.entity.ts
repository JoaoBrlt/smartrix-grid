import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Price {
  /**
    The record identifier.
   */
  @PrimaryGeneratedColumn()
  public id: number;

  /**
   * The price (float amount).
   * Need to precise 'float' in the parameter, otherwise postgres will create the field as an Int
   */
  @Column('float')
  public price: number;

  /**
   * The date of the addition of this price
   */
  @Column()
  public date: Date;
}
