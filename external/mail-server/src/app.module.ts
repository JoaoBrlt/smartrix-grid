import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MailServerController } from './controllers/mail-server.controller';
import Configuration from './config/configuration';
import { MailServerService } from './services/mail-server.service';

@Module({
  imports: [
    // Configuration.
    ConfigModule.forRoot({
      load: [Configuration],
    }),
  ],
  controllers: [
    // Controllers.
    MailServerController,
  ],
  providers: [
    // Services.
    MailServerService,
  ],
})
export class AppModule {}
