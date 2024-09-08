// auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        PassportModule,
        ConfigModule.forRoot(), // Ensure this line is present
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => {
                const secret = configService.get<string>('JWT_SECRET');
                return {
                    secret,
                    signOptions: { expiresIn: '1h' },
                };
            },
        }),
    ],
    providers: [JwtStrategy, JwtService],
    exports: [JwtModule],
})
export class AuthModule { }
