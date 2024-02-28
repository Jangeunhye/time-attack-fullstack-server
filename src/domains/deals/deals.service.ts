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
        imageUrl: fileName,
      },
    });

    return post;
  }

  async getDeals() {
    const deals = await this.prismaService.post.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return deals;
  }

  async getDeal(id: number) {
    const deal = await this.prismaService.post.findUnique({
      where: {
        id,
      },
    });

    return deal;
  }

  async updateView(id: number) {
    const deal = await this.prismaService.post.update({
      where: {
        id,
      },
      data: {
        view: { increment: 1 },
      },
    });

    return deal;
  }

  async getMyDeals(userId: string) {
    const deals = await this.prismaService.post.findMany({
      where: { userId },
    });

    return deals;
  }
}
