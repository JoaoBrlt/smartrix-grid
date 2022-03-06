import { Injectable } from '@nestjs/common';

@Injectable()
export class PriceService {
  public purchasePrice = 1;
  public sellingPrice = 1;
}
