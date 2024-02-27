import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './db/prisma/prisma.module';
import { DomainsModule } from './domains/domains.module';

@Module({
  imports: [PrismaModule, DomainsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
