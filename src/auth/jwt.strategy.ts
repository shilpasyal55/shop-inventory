import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
   
    constructor(private configService: ConfigService) {
        const secret = configService.get<string>('JWT_SECRET');
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: secret, // Use a secret from environment config
        });
    }

    async validate(payload: any) {
        return { userId: payload.id, email: payload.email }; // What you return here gets injected into req.user
    }
}
