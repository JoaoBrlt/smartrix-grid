import { IsNotEmpty, IsNumber } from 'class-validator';

export class AssignerDto {
  /**
   * The id of the customer/household
   */
  @IsNotEmpty()
  @IsNumber()
  public customerId: number;

  /**
   * The id of the community, 1 community can contain 0 to n customers/households
   */
  @IsNotEmpty()
  @IsNumber()
  public communityId: number;
}
