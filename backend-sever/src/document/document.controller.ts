import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  NotFoundException,
  Patch,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { DocumentService } from './document.service';
import { DocumentDto, UpdateDocumentDto } from './document.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { isValidObjectId } from 'mongoose';

@Controller('documents')
export class DocumentController {
  private readonly logger = new Logger(DocumentController.name);

  constructor(private readonly documentService: DocumentService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllDocuments() {
    this.logger.log(`document-controller - getAllDocuments`);
    return await this.documentService.getAllDocuments();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getDocumentById(@Param('id') id: string) {
    this.logger.log(`Fetching document with id hello: ${id}`);

    if (!isValidObjectId(id)) {
      throw new NotFoundException('Invalid document ID');
    }
    const document = await this.documentService.getDocumentById(id);
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  @Get('/getDocumentsByUserId/:userId')
  @UseGuards(JwtAuthGuard)
  async getDocumentsByUserId(@Param('userId') userId: string) {
    this.logger.log(`document controller -  getDocumentsByUserId, ${userId}`);
    if (!isValidObjectId(userId)) {
      throw new NotFoundException(
        'Invalid userId ID... Please provide correct user Id',
      );
    }
    const documents = await this.documentService.getDocumentsByUserId(userId);
    if (documents.length === 0) {
      this.logger.log(documents);
      throw new NotFoundException('Documents not found');
    }
    return documents;
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createDocument(@Body() documentDto: DocumentDto) {
    return await this.documentService.createDocument(documentDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateDocument(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    userId: string,
  ) {
    if (!updateDocumentDto || Object.keys(updateDocumentDto).length === 0) {
      throw new BadRequestException('Update document payload is empty');
    }

    return await this.documentService.updateDocument(
      id,
      updateDocumentDto,
      userId,
    );
  }

  @Delete('/deleteDocument/:id')
  @UseGuards(JwtAuthGuard)
  async deleteDocument(@Param('id') id: string) {
    this.logger.log(`inside deleteDocument : ${id}`);
    return await this.documentService.deleteDocument(id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteAllDocuments(): Promise<void> {
    this.logger.log(`inside deleteAllDocuments `);
    await this.documentService.deleteAllDocuments();
  }

  @Post('/add-collaborator')
  @UseGuards(JwtAuthGuard)
  async addCollaborator(@Body() collaboratorsData: any): Promise<any> {
    const { sharedBy, sharedWith, documentId } = collaboratorsData;
    this.logger.log('\n' + sharedBy + '\n' + sharedWith + '\n' + documentId);
    const collaboratorsList =
      await this.documentService.addCollaborator(collaboratorsData);
    return collaboratorsList;
  }

  @Get('/get-collaborators:documentId')
  @UseGuards(JwtAuthGuard)
  async getCollaborators(documentId: string): Promise<any> {
    return await this.documentService.getCollaborators(documentId);
  }
}
