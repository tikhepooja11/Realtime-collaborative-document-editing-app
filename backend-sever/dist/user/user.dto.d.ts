import { IDocument } from 'src/document/document.schema';
export declare class UserDto {
    fullname: string;
    email: string;
    password: string;
    documents: IDocument[];
    clientId: string;
}
export declare class UserSignInDto {
    email: string;
    password: string;
}
export declare class UpdateUserDto {
    fullname?: string;
    documents?: IDocument[];
    clientId?: string;
    sharedWith?: IDocument[];
}
