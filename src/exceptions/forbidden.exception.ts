import { HttpStatus } from "@nestjs/common";

import AppException from "./app.exception";

export default class ForbiddenException<
  K extends string,
  V,
> extends AppException {
  constructor(message: Record<K, V>) {
    super({
      message,
      code: "Forbidden",
      status: HttpStatus.FORBIDDEN,
    });
  }
}
