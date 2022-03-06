import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class PriceDateDto {
  /**
   * The date to find the corresponding price in the db
   */
  @IsDate()
  @Type(() => Date)
  public date?: Date;
}
