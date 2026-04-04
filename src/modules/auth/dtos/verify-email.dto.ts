import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class VerifyEmailDto {
  @IsString()
  @IsNotEmpty({ message: "Token is required" })
  @ApiProperty()
  token: string;
}
