import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ProductionMetrics } from '../dtos/production-metrics.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ProductionWriterService {
  /**
   * The URL of the production-writer service.
   */
  private readonly serviceURL: string;

  /**
   * Constructs the production-writer manager service.
   * @param httpService The HTTP client.
   * @param configService The configuration service.
   */
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    const host = configService.get<string>('productionWriter.host');
    const port = configService.get<number>('productionWriter.port');
    this.serviceURL = `http://${host}:${port}/production-writer`;
  }

  /**
   * Sends a production.
   * @param prod The production metrics to be sent.
   */
  public async sendProduction(prod: ProductionMetrics): Promise<void> {
    await axios.post(`${this.serviceURL}`, prod).catch((e) => {
      console.error(e);
      throw e;
    });
    // await this.httpService.post(`${this.writerServiceURL}`, prod).subscribe(
    //   (r) => {
    //     return r;
    //   },
    //   (e) => {
    //     console.log(e);
    //     throw e;
    //   },
    // );
  }
}
