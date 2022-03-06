import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { MetersIndicationDto } from '../dtos/meters-indication.dtos';

@Injectable()
export class SimulationSubscriptionService {
  /**
   * The URL of the community manager service.
   */
  private readonly serviceURL: string;
  private subscribed = false;

  /**
   * Constructs the simulation service.
   * @param configService The configuration service.
   * @param httpService
   */
  constructor(private readonly configService: ConfigService, private httpService: HttpService) {
    const host = configService.get<string>('simulationService.host');
    const port = configService.get<number>('simulationService.port');
    this.serviceURL = `http://${host}:${port}`;
  }

  /**
   * Redirect.
   */
  public async redirectIfSub(directive: MetersIndicationDto): Promise<void> {
    if (!this.subscribed) return;
    await this.httpService.post<void>(`${this.serviceURL}/simulator/indicate`, directive).subscribe();
  }

  /**
   * Sub.
   */
  public sub(): void {
    this.subscribed = true;
  }
}
