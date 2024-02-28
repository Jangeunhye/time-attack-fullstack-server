import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as fs from 'fs/promises';
import { nanoid } from 'nanoid';
import { join } from 'path';
import { PrismaService } from 'src/db/prisma/prisma.service';
import { Image, WithOutImageDealDto } from './deals.dto';

@Injectable()
export class DealsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createDeal(user: User, data: WithOutImageDealDto, image: Image) {
    console.log(image.buffer);
    const userId = user.id;

    const { title, content, location, price } = data;

    const basePath = join(__dirname, '../../../public/images');
    const fileNameBase = nanoid();
    const fileExtension = image.originalname.split('.').pop();
    const fileName = `${fileNameBase}.${fileExtension}`;
    const path = join(basePath, fileName);

    await fs.writeFile(path, image.buffer);

    const post = await this.prismaService.post.create({
      data: {
        title,
        content,
        location,
        price,
        view: 0,
        userId,
        imagUrl: path,
      },
    });

    return post;
  }

  async getDeals() {
    const deals = await this.prismaService.post.findMany({});
    return deals;
  }
}
