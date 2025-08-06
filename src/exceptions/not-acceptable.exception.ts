import { HttpStatus } from "@nestjs/common";

import AppException from "./app.exception";

export default class NotAcceptableException<
  K extends string,
  V,
> extends AppException {
  constructor(message: Record<K, V>) {
    super({
      message,
      code: "NotAcceptable",
      status: HttpStatus.NOT_ACCEPTABLE,
    });
  }
}
