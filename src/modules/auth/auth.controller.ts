import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse
} from "@nestjs/swagger";
import { AccessToken } from "src/decorators/access-token.decorator";
import { ResponseMessage } from "src/decorators/response-message.decorator";
import { Public } from "src/decorators/skip-auth.decorator";
import { UseUnauthGuard } from "src/decorators/use-unauth.decorator";
import { ThrottlerIpGuard } from "../../guards/throttler-ip.guard";
import { AuthService } from "./auth.service";
import { ForgotPasswordDto } from "./dtos/forgot-password.dto";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/registration.dto";
import { ResendVerificationDto } from "./dtos/resend-verification.dto";
import { ResetPasswordDto } from "./dtos/reset-password.dto";
import { VerifyEmailDto } from "./dtos/verify-email.dto";

@ApiTags("auth")
@Controller({ version: "1" })
@UseGuards(ThrottlerIpGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @UseUnauthGuard()
  @ResponseMessage("Registration successful")
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ description: "User has been registered" })
  @ApiBadRequestResponse({ description: "Invalid input or not allowed role" })
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @UseUnauthGuard()
  @ResponseMessage("Login successful")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: "User has been logged successfully" })
  @ApiNotFoundResponse({ description: "Username and password does not matched" })
  @ApiBadRequestResponse({ description: "Username and password does not matched" })
  login(@Body() loginUserDto: LoginDto) {
    return this.authService.login(loginUserDto);
  }

  @Get("load")
  @Public()
  @ResponseMessage("Loaded user")
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOkResponse({ description: "User has been logged successfully" })
  @ApiNotFoundResponse({ description: "Invalid user" })
  @ApiUnauthorizedResponse({ description: "You are not authenticated" })
  loadUser(@AccessToken() token: string) {
    return this.authService.authAccount(token);
  }

  @Post("verify-email")
  @UseUnauthGuard()
  @ResponseMessage("Email verified successfully")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: "Email has been verified" })
  @ApiBadRequestResponse({ description: "Invalid or expired token" })
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post("resend-verification")
  @UseUnauthGuard()
  @ResponseMessage("Verification email sent")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: "Verification email sent if account exists and is unverified" })
  resendVerification(@Body() dto: ResendVerificationDto) {
    return this.authService.resendVerification(dto);
  }

  @Post("forgot-password")
  @UseUnauthGuard()
  @ResponseMessage("Reset email sent")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: "Password reset email sent if account exists" })
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Post("reset-password")
  @UseUnauthGuard()
  @ResponseMessage("Password reset successful")
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({ description: "Password has been reset" })
  @ApiBadRequestResponse({ description: "Invalid or expired token" })
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
