import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, Matches, MaxLength, MinLength } from "class-validator";
import { IdentityConfirmationDto } from "src/common/identity-confirmation.dto";
import { Trim } from "src/utils/transformers/trim.decorator";
import { MatchField } from "src/utils/validators/match-field.validator";
import { ValidationMessages } from "src/utils/validators/validation-message";

export class UpdatePasswordDto extends IdentityConfirmationDto {
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[^a-zA-Z\d]).+$/, {
    message:
      "Password must contain at least one letter, one number, and one special character",
  })
  @MaxLength(64, {
    message: ValidationMessages.maxLength("Password", 64),
  })
  @MinLength(8, {
    message: ValidationMessages.minLength("Password", 8),
  })
  @IsNotEmpty({
    message: "Password is required",
  })
  @Trim()
  @ApiProperty()
  newPassword: string;

  @MatchField("newPassword", {
    message: "Confirm password does not match with new password",
  })
  @IsNotEmpty({
    message: "Confirm password is required",
  })
  @Trim()
  @ApiProperty()
  confirmPassword: string;
}
