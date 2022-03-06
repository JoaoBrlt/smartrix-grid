import { Injectable } from '@nestjs/common';
import { EmailDto } from '../dtos/email.dto';

@Injectable()
export class MailServerService {
  /**
   * Sends an email.
   * @param email The email to be sent.
   */
  public sendEmail(email: EmailDto): void {
    console.log('Sent email:', email);
  }
}
