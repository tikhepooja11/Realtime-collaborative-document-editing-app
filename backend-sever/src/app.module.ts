import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SocketGateway } from './socket/socket.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { UserSchema } from './user/user.schema';
import { DocumentModule } from './document/document.module';
import { DocumentSchema } from './document/document.schema';
import { DocumentService } from './document/document.service';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { DocumentController } from './document/document.controller';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.DATABASE_URL),
    AuthModule,
    UserModule,
    DocumentModule,
    MongooseModule.forFeature([
      { name: 'User', schema: UserSchema },
      {
        name: 'Document',
        schema: DocumentSchema,
      },
    ]),
  ],
  controllers: [AppController, UserController, DocumentController],
  providers: [AppService, SocketGateway, DocumentService, UserService],
})
export class AppModule {}
