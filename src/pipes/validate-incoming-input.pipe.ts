import { Injectable, ValidationError, ValidationPipe } from "@nestjs/common";

import BadRequestException from "../exceptions/bad-request.exception";

function exceptionFactory(validationErrors: ValidationError[]) {
  const errors: Record<string, string> = {};

  function mapErrors(errorList: ValidationError[], parentPath = "") {
    for (const error of errorList) {
      const propertyPath = parentPath
        ? `${parentPath}.${error.property}`
        : error.property;

      if (error.constraints) {
        errors[propertyPath] = Object.values(error.constraints).join(", ");
      }

      if (error.children?.length) {
        mapErrors(error.children, propertyPath);
      }
    }
  }

  mapErrors(validationErrors);

  return new BadRequestException(errors);
}

@Injectable()
export class ValidateIncomingInput extends ValidationPipe {
  constructor(options: Record<string, any>) {
    options = {
      ...options,
      stopAtFirstError: true,
      // whitelist will be handled manually in the StripRequestBodyPipe
      // so we set it to false here
      // this is because we need to validate the incoming data first
      // and then strip the unwanted properties
      whitelist: false,
      exceptionFactory: exceptionFactory,
      transform: true,
    };
    super(options);
  }
}
