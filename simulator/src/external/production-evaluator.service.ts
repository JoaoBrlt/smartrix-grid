import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class ProductionEvaluatorService {
  /**
   * The production evaluator service URL.
   */
  private readonly serviceURL: string;

  /**
   * Constructs the production-writer manager service.
   * @param httpService The HTTP client.
   * @param configService The configuration service.
   */
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    const host = configService.get<string>('productionEvaluator.host');
    const port = configService.get<number>('productionEvaluator.port');
    this.serviceURL = `http://${host}:${port}/production-evaluator`;
  }

  /**
   * Returns a production evaluation.
   */
  public async getEvaluation(): Promise<number> {
    return axios
      .get<number>(`${this.serviceURL}/next`)
      .then((r) => r.data)
      .catch((e) => {
        console.error(e);
        throw e;
      });
    // return await firstValueFrom(this.httpService.get<number>(`${this.evaluatorServiceURL}/next`))
    // .then((response) => {
    //   return response.data;
    // });
  }
}
