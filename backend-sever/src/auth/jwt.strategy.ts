import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from './auth.service';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET, // Change this to your secret key
    });
  }

  async validate(payload: any) {
    //  `JWT validation successfull - invokes automatically after success `,
    console.log(`JWT validated : sharing auth payload :${payload}`);

    // You can add additional validation logic here (e.g., check if user exists, etc.)
    return { userId: payload.sub, username: payload.username };
  }
}
