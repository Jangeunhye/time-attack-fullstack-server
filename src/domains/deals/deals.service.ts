import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import generateRandomId from 'src/utils/generateRandomId';

@Injectable()
export class DealsService {
  async addImageToDeal(files: Array<Express.Multer.File>) {
    const parsedFiles = JSON.parse(JSON.stringify(files))['files'];
    for (const file of parsedFiles) {
      const newBuffer = Buffer.from(file.buffer, 'utf-8');
      const fileName = generateRandomId();
      await fs.writeFile(`./public/${fileName}.png`, newBuffer);
    }
  }
}
