import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MeterControllerService {
  /**
   * The meter controller service URL.
   */
  private readonly serviceURL: string;

  /**
   * Constructs the meter controller service.
   * @param httpService The HTTP client.
   * @param configService The configuration service.
   */
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {
    const host = configService.get<string>('meterController.host');
    const port = configService.get<number>('meterController.port');
    this.serviceURL = `http://${host}:${port}/meter-controller`;
  }

  /**
   * sub to the meter controller
   */
  public async sub(): Promise<void> {
    await axios.post(`${this.serviceURL}/sub`).catch((e) => {
      console.error(e);
      throw e;
    });
    // await this.httpService.post(`${this.serviceURL}/meter-controller/sub`).subscribe(
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
