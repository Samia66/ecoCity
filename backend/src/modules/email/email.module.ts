import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config/dist/config.service';
import { join } from 'path';

@Module({
    imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],

      useFactory: (
        config: ConfigService,
      ) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: Number(
            config.get('MAIL_PORT'),
          ),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },

        defaults: {
          from: config.get('MAIL_FROM'),
        },

        template: {
          dir: join(
            process.cwd(),
            'src/modules/email/templates',
          ),

          adapter:
            new HandlebarsAdapter(),

          options: {
            strict: true,
          },
        },
      }),
    }),
  ],

  providers: [EmailService],

  exports: [EmailService],
})
export class EmailModule {}
