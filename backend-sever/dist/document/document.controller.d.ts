import { DocumentService } from './document.service';
import { DocumentDto, UpdateDocumentDto } from './document.dto';
export declare class DocumentController {
    private readonly documentService;
    private readonly logger;
    constructor(documentService: DocumentService);
    getAllDocuments(): Promise<import("./document.schema").IDocument[]>;
    getDocumentById(id: string): Promise<import("./document.schema").IDocument>;
    getDocumentsByUserId(userId: string): Promise<import("./document.schema").IDocument[]>;
    createDocument(documentDto: DocumentDto): Promise<import("./document.schema").IDocument>;
    updateDocument(id: string, updateDocumentDto: UpdateDocumentDto, userId: string): Promise<import("./document.schema").IDocument>;
    deleteDocument(id: string): Promise<void>;
    deleteAllDocuments(): Promise<void>;
    addCollaborator(collaboratorsData: any): Promise<any>;
    getCollaborators(documentId: string): Promise<any>;
}
