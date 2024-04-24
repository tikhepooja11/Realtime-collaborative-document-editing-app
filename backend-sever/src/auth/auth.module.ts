import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModel, UserSchema } from '../user/user.schema';
import * as dotenv from 'dotenv'; // Import dotenv
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { DocumentModule } from 'src/document/document.module';
import { DocumentService } from 'src/document/document.service';
dotenv.config();

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Change this to a secure secret key
      signOptions: { expiresIn: '1h' }, // Token expiration time
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    UserModule, // Import UserModule,
    DocumentModule, // Import DocumentModule
  ],
  providers: [AuthService, JwtStrategy, UserService, DocumentService],
  controllers: [AuthController],
  exports: [AuthService], // Export AuthService for use in other modules
})
export class AuthModule {}
