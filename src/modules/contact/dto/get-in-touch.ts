import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { Trim } from "src/utils/transformers/trim.decorator";

export class GetInTouchDto {
  @IsString({
    message: "First name must be string",
  })
  @IsNotEmpty({
    message: "First name is required",
  })
  @Trim()
  firstName: string;

  @IsString({
    message: "Last name must be string",
  })
  @IsNotEmpty({
    message: "Last name is required",
  })
  @Trim()
  lastName: string;

  @IsEmail({}, { message: "Invalid email" })
  @IsNotEmpty({
    message: "Last name is required",
  })
  @Trim()
  email: string;

  @IsString({
    message: "Invalid phone no.",
  })
  @IsNotEmpty({
    message: "Phone no. is required",
  })
  @Trim()
  phone: string;

  @IsString({
    message: "Message must be string",
  })
  @IsNotEmpty({
    message: "Message is required",
  })
  @Trim()
  message: string;
}
