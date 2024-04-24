import { Module, forwardRef } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentSchema } from './document.schema';
import { UserModule } from 'src/user/user.module';
// import { DocumentsGateway } from './documents.gateway';

@Module({
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([{ name: 'Document', schema: DocumentSchema }]),
  ],
  controllers: [DocumentController],
  providers: [DocumentService], //DocumentModule
  exports: [DocumentService, MongooseModule],
})
export class DocumentModule {}
