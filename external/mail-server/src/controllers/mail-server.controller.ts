import { Body, Controller, Post } from '@nestjs/common';
import { MailServerService } from '../services/mail-server.service';
import { EmailDto } from '../dtos/email.dto';

@Controller('mail-server')
export class MailServerController {
  /**
   * Constructs the mail server controller.
   * @param mailServerService The mail server service.
   */
  constructor(private readonly mailServerService: MailServerService) {}

  /**
   * Sends an email.
   * @param email The email to be sent.
   */
  @Post()
  public sendEmail(@Body() email: EmailDto): void {
    this.mailServerService.sendEmail(email);
  }
}
