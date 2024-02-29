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

    const deal = await this.prismaService.deal.create({
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

    return deal;
  }

  async getDeals() {
    const deals = await this.prismaService.deal.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return deals;
  }

  async getDeal(id: number) {
    const deal = await this.prismaService.deal.findUnique({
      where: {
        id,
      },
      include: { user: true },
    });

    return deal;
  }

  async updateView(id: number) {
    const deal = await this.prismaService.deal.update({
      where: {
        id,
      },
      data: {
        view: { increment: 1 },
      },
      include: { user: true },
    });

    return deal;
  }

  async getMyDeals(userId: string) {
    const deals = await this.prismaService.deal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return deals;
  }

  async deleteDeal(user: User, dealId: number) {
    const checkedDeal = await this.prismaService.deal.delete({
      where: { userId: user.id, id: dealId },
    });
    return checkedDeal;
  }

  async editDeal(dealId: number, user: User, data: WithOutImageDealDto) {
    const userId = user.id;

    const { title, content, location, price } = data;

    const deal = await this.prismaService.deal.update({
      where: { id: dealId, userId },
      data: {
        title,
        content,
        location,
        price,
      },
    });

    return deal;
  }

  async addLike(user: User, dealId: number) {
    const userId = user.id;

    const deal = await this.prismaService.likedDeal.create({
      data: { userId, dealId },
    });

    return deal;
  }

  async deleteLike(user: User, dealId: number) {
    const userId = user.id;

    const deal = await this.prismaService.likedDeal.delete({
      where: { userId_dealId: { userId, dealId } },
    });
    return deal;
  }
}
