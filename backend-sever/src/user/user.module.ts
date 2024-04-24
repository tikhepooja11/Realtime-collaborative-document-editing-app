import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.schema';
import { DocumentService } from 'src/document/document.service';
import { DocumentModule } from 'src/document/document.module';

@Module({
  imports: [
    forwardRef(() => DocumentModule),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, DocumentService],
  exports: [UserService, MongooseModule],
})
export class UserModule {}
