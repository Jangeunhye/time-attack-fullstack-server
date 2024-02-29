import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
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
    const deal = await this.dealsService.updateView(dealId);
    return deal;
  }

  @Post('deals/create')
  @UserOnly()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  async createDeal(
    @DUser() user: User,
    @Body() dto: WithOutImageDealDto,
    @UploadedFiles() image: Express.Multer.File,
  ) {
    const data = JSON.parse(dto['deal']);
    const parsedImage = image['image'][0];
    const deal = await this.dealsService.createDeal(user, data, parsedImage);
    return deal;
  }

  @Put('deals/:dealId/edit')
  @UserOnly()
  async editDeal(
    @DUser() user: User,
    @Body() dto: WithOutImageDealDto,
    @Param('dealId', ParseIntPipe) dealId: number,
  ) {
    const deal = await this.dealsService.editDeal(dealId, user, dto);
    return deal;
  }

  @Delete('deals/:dealId')
  @UserOnly()
  async deleteDeal(
    @DUser() user: User,
    @Param('dealId', ParseIntPipe) dealId: number,
  ) {
    const deal = await this.dealsService.deleteDeal(user, dealId);
    return deal;
  }

  @Post('deals/:dealId/like')
  @UserOnly()
  async addLike(
    @DUser() user: User,
    @Param('dealId', ParseIntPipe) dealId: number,
  ) {
    const deal = await this.dealsService.addLike(user, dealId);
    return deal;
  }

  @Delete('deals/:dealId/like')
  @UserOnly()
  async deleteLike(
    @DUser() user: User,
    @Param('dealId', ParseIntPipe) dealId: number,
  ) {
    const deal = await this.dealsService.deleteLike(user, dealId);
    return deal;
  }
}
