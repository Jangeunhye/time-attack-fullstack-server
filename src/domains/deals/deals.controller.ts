import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
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
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'files', maxCount: 3 },
      { name: 'post', maxCount: 1 },
    ]),
  )
  uploadMainImage(
    @Body() dto: any,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    return this.dealsService.addImageToDeal(files);
  }
}
