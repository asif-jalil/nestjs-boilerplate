import { Injectable } from "@nestjs/common";
import { Queue } from "bullmq";
import { InAppEmail } from "src/constants/queue.enum";
import { InjectInAppEmail } from "src/decorators/inject-queue.decorator";
import { GetInTouchDto } from "./dto/get-in-touch";

@Injectable()
export class ContactService {
  constructor(
    @InjectInAppEmail() private readonly inAppEmail: Queue<GetInTouchDto>,
  ) {}

  async getInTouch(dto: GetInTouchDto) {
    await this.inAppEmail.add(
      InAppEmail.GET_IN_TOUCH,
      { ...dto },
      { removeOnComplete: true },
    );

    return;
  }
}
