/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
import { Model } from 'mongoose';
import { DocumentDto, UpdateDocumentDto } from './document.dto';
import { IDocument } from './document.schema';
import { UserService } from 'src/user/user.service';
export declare class DocumentService {
    private readonly userService;
    private readonly documentModel;
    private readonly logger;
    constructor(userService: UserService, documentModel: Model<IDocument>);
    getAllDocuments(): Promise<IDocument[]>;
    getDocumentById(id: string): Promise<IDocument>;
    getDocumentsByUserId(userId: string): Promise<IDocument[]>;
    createDocument(documentDto: DocumentDto): Promise<IDocument>;
    hasAccess: (userId: string, document: IDocument) => boolean;
    updateDocument(id: string, updateDocumentDto: UpdateDocumentDto, userId: string): Promise<IDocument>;
    deleteDocument(id: string): Promise<void>;
    deleteAllDocuments(): Promise<void>;
    getCollaborators(documentId: string): Promise<any>;
    addCollaborator(collaboratorsData: any): Promise<any>;
}
