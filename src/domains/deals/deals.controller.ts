import {
  Body,
  Controller,
  Get,
  Post,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { User } from '@prisma/client';
import { Response } from 'express';
import { DUser } from 'src/decorator/user.decorator';
import { UserOnly } from 'src/decorator/useronly.decorator';
import { WithOutImageDealDto } from './deals.dto';
import { DealsService } from './deals.service';

@Controller()
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  @Post('deals/create')
  @UserOnly()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'files', maxCount: 3 }]))
  createDeal(
    @DUser() user: User,
    @Body() dto: WithOutImageDealDto,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    const data = JSON.parse(dto['post']);
    return this.dealsService.createDeal(user, data, files);
  }

  @Get()
  async getDeals(@Res({ passthrough: true }) response: Response) {
    const deals = await this.dealsService.getDeals();
    response.sendJson(deals);
  }
}
