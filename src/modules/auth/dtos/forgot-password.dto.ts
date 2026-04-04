import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";
import { Trim } from "src/utils/transformers/trim.decorator";

export class ForgotPasswordDto {
  @IsEmail({}, { message: "Valid email is required" })
  @IsNotEmpty({ message: "Email is required" })
  @Trim()
  @ApiProperty()
  email: string;
}
