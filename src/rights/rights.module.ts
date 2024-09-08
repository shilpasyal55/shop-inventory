import { Module } from '@nestjs/common';
import { RightsService } from './rights.service';
import { RightsController } from './rights.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  providers: [RightsService],
  controllers: [RightsController]
})
export class RightsModule {}
