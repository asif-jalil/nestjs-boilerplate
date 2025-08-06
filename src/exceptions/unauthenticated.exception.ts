import { HttpStatus } from "@nestjs/common";

import AppException from "./app.exception";

export default class UnauthenticatedException<
  K extends string,
  V,
> extends AppException {
  constructor(message: Record<K, V>) {
    super({
      message,
      code: "Unauthenticated",
      status: HttpStatus.UNAUTHORIZED,
    });
  }
}
