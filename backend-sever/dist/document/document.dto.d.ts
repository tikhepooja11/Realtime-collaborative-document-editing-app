export declare class DocumentDto {
    title: string;
    userId: string;
    content?: string;
    collaborators?: [string];
}
export declare class UpdateDocumentDto {
    title?: string;
    content?: string;
    collaborators?: [string];
}
