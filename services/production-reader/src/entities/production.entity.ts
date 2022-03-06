import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Production {
  /**
   * The production identifier.
   */
  @PrimaryGeneratedColumn()
  public id: number;

  /**
   * The amount of energy produced by the power plant.
   */
  @Column()
  public amount: number;

  /**
   * The date of production of the energy.
   */
  @Column()
  public date: Date;
}
