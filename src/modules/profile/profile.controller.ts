import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AuthUser } from "src/decorators/auth-user.decorator";
import { ResponseMessage } from "src/decorators/response-message.decorator";
import { IdentityConfirmationGuard } from "src/guards/identity-confirmation.guard";
import { User } from "../user/user.entity";
import { UpdatePasswordDto } from "./dtos/update-password.dto";
import { ProfileService } from "./profile.service";

@ApiTags("profile")
@Controller({
  version: "1",
})
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Patch("password")
  @UseGuards(IdentityConfirmationGuard)
  @ResponseMessage("Password updated successfully")
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Password updated" })
  @ApiNotFoundResponse({ description: "User not found" })
  async updatePassword(
    @Body() dto: UpdatePasswordDto,
    @AuthUser() user: Partial<User>,
  ) {
    return this.profileService.updatePassword(user.id as number, dto);
  }

  @Get()
  @ResponseMessage("Profile retrieved successfully")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "Profile retrieved" })
  @ApiNotFoundResponse({ description: "User not found" })
  async getProfile(@AuthUser() user: Partial<User>) {
    return this.profileService.getProfile(user.id as number);
  }
}
