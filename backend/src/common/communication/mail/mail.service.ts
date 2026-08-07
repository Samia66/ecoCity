import {
  Inject,
  Injectable,
} from '@nestjs/common';



import { MAIL_PROVIDER } from '../constants/mail.constants';
import { MailProvider } from '../interfaces/mail-provider.interface';

@Injectable()
export class MailService {

  constructor(
    @Inject(MAIL_PROVIDER)
    private readonly provider: MailProvider,
  ) {}

  sendVerificationEmail(
    email: string,
    token: string,
  ) {

    return this.provider.send({

      to: email,

      subject: 'Verify your email',

      template:
        'verify-email',

      context: {
        token,
      },
    });

  }

  sendForgotPasswordEmail(
    email: string,
    token: string,
  ) {

    return this.provider.send({

      to: email,

      subject:
        'Reset your password',

      template:
        'forgot-password',

      context: {
        token,
      },
    });

  }

}