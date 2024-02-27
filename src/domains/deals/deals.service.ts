import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';

@Injectable()
export class DealsService {
  async addImageToDeal(file: Express.Multer.File) {
    await fs.writeFile(`./public/${file.originalname}`, file.buffer);
  }
}
