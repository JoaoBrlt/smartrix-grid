import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Assigner {
  /**
   * The id of the customer/household - UNIQUE id
   */
  @PrimaryColumn()
  public customerId: number;

  /**
   * The id of the community, 1 community can contain 0 to n customers/households
   */
  @Column()
  public communityId: number;
}
