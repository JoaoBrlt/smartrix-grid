import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateAssignerDto {
  /**
   * The id of the community, 1 community can contain 0 to n customers/households
   */
  @IsNotEmpty()
  @IsNumber()
  public communityId: number;
}
