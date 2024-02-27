import { Module } from '@nestjs/common';
import { UsersModule } from './accounts/users/users.module';

@Module({
  imports: [UsersModule]
})
export class DomainsModule {}
