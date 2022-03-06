import { IsDate, IsNotEmpty, IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class InvoiceDto {
  /**
   * The customer identifier.
   */
  @IsNotEmpty()
  @IsNumber()
  public customerId: number;

  /**
   * The total purchase price of energy since the last invoice of the customer (in €).
   * If the amount is positive, it is the amount to be invoiced to the customer.
   * On the contrary, if the amount is negative, it is the amount to be credited to the customer.
   */
  @IsNumber({ maxDecimalPlaces: 4 })
  @Min(0)
  @IsNotEmpty()
  public amount: number;

  /**
   * The invoice start date.
   */
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  public firstDate: Date;

  /**
   * The invoice end date.
   */
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  public lastDate: Date;
}
