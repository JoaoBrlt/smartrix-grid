import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class EmailDto {
  /**
   * The sender of the email.
   */
  @IsString()
  @IsNotEmpty()
  public sender: string;

  /**
   * The recipient of the email.
   */
  @IsString()
  @IsNotEmpty()
  public recipient: string;

  /**
   * The subject of the email.
   */
  @IsString()
  @IsNotEmpty()
  public subject: string;

  /**
   * The message of the email.
   */
  @IsString()
  @IsNotEmpty()
  public message: string;

  /**
   * The date of the email.
   */
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  public date: Date;
}
