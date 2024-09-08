import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [InventoryService, ConfigService],
  controllers: [InventoryController]
})
export class InventoryModule {}
