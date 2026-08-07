import { Module } from '@nestjs/common';



import { MAIL_PROVIDER } from './constants/mail.constants';
import { MailService } from './mail/mail.service';
import { ResendProvider } from './mail/provider/resend.provider';
import { ConfigModule } from '@nestjs/config/dist/config.module';

@Module({
    imports: [
        ConfigModule,
    ],
    providers: [
        MailService,
        ResendProvider,
        {
            provide: MAIL_PROVIDER,

            useExisting:
                ResendProvider,
        },

    ],

    exports: [
        MailService,
    ],

})
export class CommunicationModule { }