import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ProviderDto {
  /**
   * The id of the community - UNIQUE id
   */
  @IsNotEmpty()
  @IsNumber()
  public communityId: number;

  /**
   * The name of the location of the community
   */
  @IsNotEmpty()
  @IsString()
  public location: string;
}
