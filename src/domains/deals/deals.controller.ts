import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { DUser } from 'src/decorator/user.decorator';
import { UserOnly } from 'src/decorator/useronly.decorator';
import { WithOutImageDealDto } from './deals.dto';
import { DealsService } from './deals.service';

@Controller()
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Get('my/deals')
  @UserOnly()
  async getMyDeals(@DUser() user: User) {
    const userId = user.id;
    const deal = await this.dealsService.getMyDeals(userId);
    return deal;
  }

  @Get()
  async getDeals() {
    const deals = await this.dealsService.getDeals();
    return deals;
  }

  @Get('/deals/:dealId')
  async getDeal(@Param('dealId', ParseIntPipe) dealId: number) {
    await this.dealsService.updateView(dealId);
    const deal = await this.dealsService.getDeal(dealId);
    return deal;
  }

  @Post('deals')
  @UserOnly()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  async createDeal(
    @DUser() user: User,
    @Body() dto: WithOutImageDealDto,
    @UploadedFiles() image: Express.Multer.File,
  ) {
    const data = JSON.parse(dto['post']);
    const parsedImage = image['image'][0];
    console.log(data);
    const deal = await this.dealsService.createDeal(user, data, parsedImage);
    return deal;
  }
}
