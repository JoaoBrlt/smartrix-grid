import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Provider {
  /**
   * The id of the community - UNIQUE id
   */
  @PrimaryColumn()
  public communityId: number;

  /**
   * The name of the location of the community
   */
  @Column()
  public location: string;
}
