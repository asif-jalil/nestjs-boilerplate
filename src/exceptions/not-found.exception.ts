import { HttpStatus } from "@nestjs/common";

import AppException from "./app.exception";

export default class NotFoundException<
  K extends string,
  V,
> extends AppException {
  constructor(message: Record<K, V>) {
    super({
      message,
      code: "NotFound",
      status: HttpStatus.NOT_FOUND,
    });
  }
}
