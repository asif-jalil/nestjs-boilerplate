import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";
import { Trim } from "src/utils/transformers/trim.decorator";
import { MatchField } from "src/utils/validators/match-field.validator";
import { ValidationMessages } from "src/utils/validators/validation-message";

export class ResetPasswordDto {
  @IsString()
  @IsNotEmpty({ message: "Token is required" })
  @ApiProperty()
  token: string;

  @IsNotEmpty({ message: "Password is required" })
  @MaxLength(64, { message: ValidationMessages.maxLength("Password", 64) })
  @MinLength(4, { message: ValidationMessages.minLength("Password", 4) })
  @Trim()
  @ApiProperty()
  password: string;

  @MatchField("password", { message: "Passwords do not match" })
  @IsNotEmpty({ message: "Confirm password is required" })
  @Trim()
  @ApiProperty()
  confirmPassword: string;
}
