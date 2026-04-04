import { MailerService } from "@nestjs-modules/mailer";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { Logger } from "@nestjs/common";
import { Job } from "bullmq";
import * as fs from "fs/promises";
import Handlebars from "handlebars";
import { htmlToText } from "html-to-text";
import path from "path";
import { MailConfig } from "src/config/mail";
import { InAppEmail, Queues } from "src/constants/queue.enum";
import { EnvService } from "src/shared/services/env.service";

interface Address {
  name: string;
  address: string;
}

export interface EmailJobData {
  to: string | Address;
  from?: string | Address;
  replyTo?: string | Address;
  subject: string;
  template: string;
  context?: Record<string, unknown>;
}

export interface BaseEmailData {
  to: string | Address;
  from?: string | Address;
  replyTo?: string | Address;
  context?: Record<string, unknown>;
}

@Processor(Queues.IN_APP_EMAIL)
export class InAppEmailConsumer extends WorkerHost {
  private readonly logger = new Logger(InAppEmailConsumer.name);

  constructor(
    private readonly mailService: MailerService,
    private readonly env: EnvService
  ) {
    super();
  }

  private getEmailConfigs(jobName: InAppEmail, data: BaseEmailData): EmailJobData[] {
    const baseContext = { ...data.context, year: new Date().getFullYear() };

    switch (jobName) {
      case InAppEmail.GET_IN_TOUCH:
        return [
          {
            subject: "New Contact Form Submission",
            template: "get-in-touch",
            to: { name: MailConfig.TO_NAME, address: MailConfig.TO_EMAIL },
            from: { name: MailConfig.FROM_NAME, address: MailConfig.FROM_EMAIL },
            replyTo: data.replyTo,
            context: baseContext
          },
          {
            subject: "Thank You for Contacting Us",
            template: "get-in-touch-confirmation",
            to: data.to,
            from: { name: MailConfig.FROM_NAME, address: MailConfig.FROM_EMAIL },
            context: baseContext
          }
        ];

      case InAppEmail.WELCOME_EMAIL:
        return [
          {
            subject: "Welcome! Enjoy your journey",
            template: "welcome-email",
            to: data.to,
            from: { name: MailConfig.FROM_NAME, address: MailConfig.FROM_EMAIL },
            context: baseContext
          }
        ];

      case InAppEmail.VERIFY_EMAIL:
        return [
          {
            subject: "Verify your email address",
            template: "verify-email",
            to: data.to,
            from: { name: MailConfig.FROM_NAME, address: MailConfig.FROM_EMAIL },
            context: baseContext
          }
        ];

      case InAppEmail.RESET_PASSWORD:
        return [
          {
            subject: "Reset your password",
            template: "reset-password",
            to: data.to,
            from: { name: MailConfig.FROM_NAME, address: MailConfig.FROM_EMAIL },
            context: baseContext
          }
        ];

      default:
        return [];
    }
  }

  private async sendEmail(config: EmailJobData): Promise<void> {
    if (this.env.isDevelopment) {
      try {
        const templatePath = path.join(__dirname, "../../../", "templates", `${config.template}.hbs`);
        const email = await fs.readFile(templatePath);
        const template = Handlebars.compile(email.toString());
        const html = template(config.context ?? {});

        this.logger.debug("Email not sent (development mode)");
        this.logger.debug(JSON.stringify({ to: config.to, subject: config.subject, template: config.template }));
        this.logger.debug(htmlToText(html));
      } catch (error) {
        this.logger.error("Template error", error instanceof Error ? error.stack : String(error));
      }
      return;
    }

    await this.mailService.sendMail(config);
  }

  async process(job: Job): Promise<void> {
    const jobName = job.name as InAppEmail;
    const data = job.data as BaseEmailData;

    const emailConfigs = this.getEmailConfigs(jobName, data);

    if (emailConfigs.length === 0) {
      this.logger.error(`Unknown email job type: ${jobName}`);
      return;
    }

    for (const emailConfig of emailConfigs) {
      await this.sendEmail(emailConfig);
    }
  }
}
