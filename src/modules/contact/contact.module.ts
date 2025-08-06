import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { RecaptchaMiddleware } from "src/middleware/recaptcha.middleware";
import { ContactController } from "./contact.controller";
import { ContactService } from "./contact.service";

@Module({
  controllers: [ContactController],
  providers: [ContactService],
})
export class ContactModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(RecaptchaMiddleware)
      .forRoutes(
        { path: "v1/contact/inquiry", method: RequestMethod.POST },
        { path: "v1/contact/software", method: RequestMethod.POST },
      );
  }
}
