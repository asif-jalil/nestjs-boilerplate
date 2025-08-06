import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { ResponseMessage } from "src/decorators/response-message.decorator";
import { Public } from "src/decorators/skip-auth.decorator";
import { ContactService } from "./contact.service";
import { GetInTouchDto } from "./dto/get-in-touch";

@ApiTags("contact")
@Controller({ version: "1" })
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Post("inquiry")
  @Public()
  @ResponseMessage("Inquiry send is in progress")
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({ description: "Inquiry send is in progress" })
  getInTouch(@Body() dto: GetInTouchDto) {
    return this.contactService.getInTouch(dto);
  }
}
