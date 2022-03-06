import { IsNotEmpty, IsString } from 'class-validator';

export class CustomerDto {
  /**
   * The customer identifier.
   */
  @IsNotEmpty()
  @IsString()
  public name: string;

  /**
   * The customer payment info.
   */
  @IsNotEmpty()
  @IsString()
  public paymentInfo: string;

  /**
   * The customer address.
   */
  @IsNotEmpty()
  @IsString()
  public address: string;
}
