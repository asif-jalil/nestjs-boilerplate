import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, MaxLength, MinLength } from "class-validator";
import { User } from "src/modules/user/user.entity";
import { Trim } from "src/utils/transformers/trim.decorator";
import { IsUnique } from "src/utils/validators/is-unique.validator";
import { ValidationMessages } from "src/utils/validators/validation-message";

export class RegisterDto {
  @IsOptional()
  @Trim()
  @ApiProperty()
  name?: string;

  @IsUnique(User, "email", { message: "User already exists" })
  @IsNotEmpty({ message: "Email is required" })
  @Trim()
  @ApiProperty()
  email: string;

  @IsNotEmpty({ message: "Password is required" })
  @MaxLength(64, { message: ValidationMessages.maxLength("Password", 64) })
  @MinLength(4, { message: ValidationMessages.minLength("Password", 4) })
  @Trim()
  @ApiProperty()
  password: string;
}
