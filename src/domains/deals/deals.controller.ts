import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DealsService } from './deals.service';

@Controller('upload')
export class DealsController {
  constructor(private readonly dealsService: DealsService) {}

  // @Post()
  // @UseInterceptors(FileInterceptor('file'))
  // uploadDealMainImage(@UploadedFile() file: Express.Multer.File) {
  //   return this.dealsService.addImageToDeal(file);
  // }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadMainImage(@UploadedFile() file: Express.Multer.File) {
    return this.dealsService.addImageToDeal(file);
  }
}
