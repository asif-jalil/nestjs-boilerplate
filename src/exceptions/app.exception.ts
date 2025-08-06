import { HttpException, HttpStatus } from "@nestjs/common";

type IAppError = {
  message: any;
  code?: string;
  status?: number;
};

export default class AppException extends HttpException {
  constructor({
    message,
    code = "InternalServerError",
    status = HttpStatus.INTERNAL_SERVER_ERROR,
  }: IAppError) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    super({ message, code }, status);
  }
}
