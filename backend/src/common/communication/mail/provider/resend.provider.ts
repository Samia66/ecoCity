import {
  Injectable,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

import { Resend } from 'resend';
import { MailProvider, SendMailOptions } from '../../interfaces/mail-provider.interface';


@Injectable()
export class ResendProvider
  extends MailProvider
{
  private readonly resend: Resend;

  constructor(
    private readonly config: ConfigService,
  ) {
    super();

    this.resend = new Resend(
      this.config.get<string>(
        'RESEND_API_KEY',
      ),
    );
  }

  async send(
    options: SendMailOptions,
  ): Promise<void> {

    await this.resend.emails.send({

      from:
        this.config.get<string>(
          'MAIL_FROM',
        )!,

      to: options.to,

      subject: options.subject,

      html: `
        <h2>${options.subject}</h2>

        <p>Template :
        ${options.template}</p>

        <pre>
        ${JSON.stringify(
          options.context,
          null,
          2,
        )}
        </pre>
      `,
    });

  }
}