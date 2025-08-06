import { HttpStatus } from "@nestjs/common";

import AppException from "./app.exception";

export default class ThrottlerException<
  K extends string,
  V,
> extends AppException {
  constructor(message: Record<K, V>) {
    super({
      message,
      code: "ThrottlerException",
      status: HttpStatus.TOO_MANY_REQUESTS,
    });
  }
}
