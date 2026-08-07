export interface SendMailOptions {
  to: string;
  subject: string;
  template: string;
  context: Record<string, unknown>;
}

export abstract class MailProvider {
  abstract send(
    options: SendMailOptions,
  ): Promise<void>;
}