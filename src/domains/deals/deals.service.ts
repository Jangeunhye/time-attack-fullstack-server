import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as fs from 'fs/promises';
import { PrismaService } from 'src/db/prisma/prisma.service';
import generateRandomId from 'src/utils/generateRandomId';
import { WithOutImageDealDto } from './deals.dto';

@Injectable()
export class DealsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createDeal(
    user: User,
    dto: WithOutImageDealDto,
    files: Array<Express.Multer.File>,
  ) {
    const userId = user.id;

    // 여러개 이미지 파일 저장
    const parsedFiles = JSON.parse(JSON.stringify(files))['files'];
    const fileNameList = [];
    for (const file of parsedFiles) {
      const newBuffer = Buffer.from(file.buffer, 'utf-8');
      const fileName = generateRandomId();
      await fs.writeFile(`./public/${fileName}.png`, newBuffer);
      fileNameList.push(fileName);
    }
    const { title, content, location, price } = dto;

    const post = await this.prismaService.post.create({
      data: {
        title,
        content,
        location,
        price,
        view: 0,
        userId,
      },
    });

    fileNameList.forEach(async (fileName) => {
      await this.prismaService.postImage.create({
        data: { postId: post.id, imageUrl: `./public/${fileName}.png` },
      });
    });

    return post;
  }

  async getDeals() {
    const deals = await this.prismaService.post.findMany({
      include: { postImages: true },
    });
    return deals;
  }
}
