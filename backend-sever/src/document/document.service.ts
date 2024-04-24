import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DocumentDto, UpdateDocumentDto } from './document.dto';
import { IDocument } from './document.schema';
import { UserService } from 'src/user/user.service';
import { UpdateUserDto } from 'src/user/user.dto';

console.log('DocumentService');

@Injectable()
export class DocumentService {
  private readonly logger = new Logger(DocumentService.name);
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,

    @InjectModel('Document')
    private readonly documentModel: Model<IDocument>,
  ) {}

  async getAllDocuments(): Promise<IDocument[]> {
    return this.documentModel.find().exec();
  }

  async getDocumentById(id: string): Promise<IDocument> {
    return await this.documentModel.findById(id).exec();
  }

  async getDocumentsByUserId(userId: string): Promise<IDocument[]> {
    console.log('inside getDocumentsByUserId');
    const documents = await this.documentModel.find({ userId }).exec();
    console.log('documents');
    console.log(documents);
    return documents;
  }

  async createDocument(documentDto: DocumentDto): Promise<IDocument> {
    const { userId } = documentDto;
    const newDocument = new this.documentModel(documentDto);
    await newDocument.save();
    const user = await this.userService.getUserById(userId);
    const userDocuments = user?.documents;
    const updatedDocumentsList = [...userDocuments, newDocument];
    const updateUser: UpdateUserDto = {
      documents: updatedDocumentsList,
    };
    await this.userService.updateUser(userId, updateUser);
    return newDocument;
  }

  hasAccess = (userId: string, document: IDocument) => {
    console.log('hasAccess userId: ' + userId);
    console.log(document.title + '\t' + document.userId);
    for (let i = 0; i < document.collaborators.length; i++) {
      if (userId === document.collaborators[i].toString()) {
        console.log('yes collaborator is editing this document');
        return true; //  are Collaborators
      }
    }
    return userId === document.userId.toString(); //  isOwner
  };

  async updateDocument(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
    userId: string,
  ): Promise<IDocument> {
    const fetchDocument = await this.getDocumentById(id);
    if (!fetchDocument) {
      throw new NotFoundException('Document Not found');
    }
    // if (!this.hasAccess(userId, fetchDocument)) {
    //   throw new UnauthorizedException('No access to this document');
    // }
    return this.documentModel
      .findByIdAndUpdate(id, updateDocumentDto, { new: true })
      .exec();
  }

  async deleteDocument(id: string): Promise<void> {
    this.logger.log('Inside delete document' + id);
    await this.documentModel.findByIdAndDelete(id).exec();
  }

  async deleteAllDocuments(): Promise<void> {
    await this.documentModel.deleteMany().exec();
  }

  async getCollaborators(documentId: string): Promise<any> {
    this.logger.log(`Getting collaborators for documentId : ${documentId}`);
  }

  async addCollaborator(collaboratorsData: any): Promise<any> {
    const {
      sharedBy: userId,
      sharedWith: collaboratorIds,
      documentId,
    } = collaboratorsData;
    //  update document with collaborators
    const updateDocumentDto: UpdateDocumentDto = {
      collaborators: collaboratorIds,
    };
    const document = await this.updateDocument(
      documentId,
      updateDocumentDto,
      userId,
    );
    this.logger.log(
      `document: ${document.title} is updated with collaborators :${JSON.stringify(document)}`,
    );

    //  update collaborators i.e collaborated users ((in sharedWith)) with documentID
    const updateUserDto: UpdateUserDto = {
      sharedWith: documentId,
    };

    const updateCollaboratorPromise = collaboratorIds.map((collaboratorId) =>
      this.userService.updateUser(collaboratorId, updateUserDto),
    );

    const updatedCollaboratorsData = await Promise.all(
      updateCollaboratorPromise,
    );
    this.logger.log(updatedCollaboratorsData);
    return document?.collaborators;
  }
}
