import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";
import { Trim } from "src/utils/transformers/trim.decorator";
import { ValidationMessages } from "src/utils/validators/validation-message";

export class LoginDto {
  @IsNotEmpty({
    message: "Email is required",
  })
  @Trim()
  @ApiProperty()
  email: string;

  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/, {
    message:
      "Password must contain at least one letter, one number, and one special character",
  })
  @MaxLength(64, {
    message: ValidationMessages.maxLength("Password", 64),
  })
  @MinLength(6, {
    message: ValidationMessages.minLength("Password", 6),
  })
  @IsNotEmpty({
    message: "Password is required",
  })
  @Trim()
  @ApiProperty()
  password: string;
}
