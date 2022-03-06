import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class Community {
  /**
   * The id of the customer/household
   */
  @IsNumber()
  @IsNotEmpty()
  public communityId: number;

  /**
   * The ids of every customers from this community
   */
  @IsArray()
  @IsNumber({}, { each: true })
  public customersIds: number[];
}
