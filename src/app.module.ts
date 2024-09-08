import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { InventoryModule } from './inventory/inventory.module';
import { RightsModule } from './rights/rights.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule, 
    UsersModule, 
    InventoryModule, 
    RightsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
