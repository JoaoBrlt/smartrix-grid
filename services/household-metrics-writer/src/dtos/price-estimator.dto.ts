import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class PriceDto {
  /**
   * The price (float amount).
   */
  @IsNotEmpty()
  @IsNumber()
  public price: number;

  /**
   * The date of the addition of this price
   */
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  public date?: Date;
}
