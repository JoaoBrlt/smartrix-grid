export class InvoiceDto {
  /**
   * The record identifier.
   */
  public id: number = 0;

  /**
   * The customer identifier.
   */
  public customerId: number = 0;

  /**
   * The total purchase price of energy since the last invoice of the customer (in €).
   * If the amount is positive, it is the amount to be invoiced to the customer.
   * On the contrary, if the amount is negative, it is the amount to be credited to the customer.
   */
  public amount: number = 0;

  /**
   * The invoice start date.
   */
  public firstDate: Date = new Date();

  /**
   * The invoice end date.
   */
  public lastDate: Date = new Date();
}
