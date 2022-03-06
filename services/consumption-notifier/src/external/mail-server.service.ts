import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MailServerService {
  /**
   * The mail server URL.
   */
  private readonly serverURL: string;

  /**
   * Constructs the mail service.
   * @param configService The configuration service.
   * @param httpService The HTTP service.
   */
  constructor(private readonly configService: ConfigService, private httpService: HttpService) {
    const host = configService.get<string>('mailServer.host');
    const port = configService.get<number>('mailServer.port');
    this.serverURL = `http://${host}:${port}/mail-server`;
  }

  /**
   * Sends an email.
   * @param sender The sender of the email.
   * @param recipient The recipient of the email.
   * @param subject The subject of the email.
   * @param message The message of the email.
   */
  public async send(sender: string, recipient: string, subject: string, message: string): Promise<void> {
    await firstValueFrom(
      this.httpService.post(this.serverURL, {
        sender,
        recipient,
        subject,
        message,
        date: new Date(),
      }),
    );
  }
}
