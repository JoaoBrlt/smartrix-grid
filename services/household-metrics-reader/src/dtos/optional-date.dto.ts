import { Type } from 'class-transformer';
import { IsDate, IsOptional } from 'class-validator';

/**
 * A optional date input for test use
 */
export class OptionalDateDto {
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  public date: Date;
}
