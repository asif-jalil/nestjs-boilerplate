import { type ExecutionContext, createParamDecorator } from "@nestjs/common";
import type { Request } from "express";

export function AccessToken() {
  return createParamDecorator((_data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<Request>();
    return request.token;
  })();
}
