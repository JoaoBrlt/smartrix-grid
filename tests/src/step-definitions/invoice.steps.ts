import { Then, When } from '@cucumber/cucumber';
import { InvoiceIssuerService } from '../services/invoice-issuer.service';
import { assert } from 'chai'
import { InvoiceDto } from '../dtos/invoice.dto';

export let date: Date = new Date();

//============================================================================//
// WHEN
//============================================================================//

let invoice: InvoiceDto;

When(/^the customer (\d+) ask for the month of (\d{4}-\d{2})$/, async (customerId: number, dateString: string) => {
  invoice = await InvoiceIssuerService.getInvoice(customerId, dateString);
});

//============================================================================//
// THEN
//============================================================================//

Then(/^he receive a invoice of (\d+)€$/, (price: number) => {
  assert.equal(price, Math.round(invoice?.amount));
});
