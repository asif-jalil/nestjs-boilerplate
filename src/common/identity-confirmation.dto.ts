import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";
import { MatchPassword } from "src/utils/validators/match-password.validator";

export class IdentityConfirmationDto {
  @MatchPassword()
  @IsOptional()
  @ApiProperty()
  password?: string;
}
