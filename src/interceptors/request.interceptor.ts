import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";

export const REQUEST_CONTEXT = "_requestContext";

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<Request>();

    if (request.body) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      request.body[REQUEST_CONTEXT] = {
        user:
          request.user && typeof request.user.toJSON === "function"
            ? request.user.toJSON()
            : request.user,
      };
    }

    return next.handle();
  }
}
