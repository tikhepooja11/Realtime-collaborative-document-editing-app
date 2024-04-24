import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user/user.service';
import { DocumentService } from 'src/document/document.service';
export declare class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly userService;
    private readonly documentService;
    server: Server;
    constructor(userService: UserService, documentService: DocumentService);
    handleConnection(client: Socket): void;
    handleJoinRoom(client: Socket, room: string): void;
    handleMessage(client: Socket, payload: {
        room: string;
        message: string;
    }): void;
    handleEditDocument(client: Socket, payload: {
        room: string;
        content: string;
    }): void;
    handleUserStartTyping(client: Socket, payload: {
        roomId: string;
        fullname: string;
        email: string;
    }): Promise<void>;
    handleUserStopTyping(client: Socket, payload: {
        roomId: string;
        fullname: string;
        email: string;
    }): Promise<void>;
    handleUpdateStyleBold(client: Socket, bold: boolean): void;
    handleUpdateStyleItalic(client: Socket, italic: boolean): void;
    handleUpdateStyleUnderline(client: Socket, underline: boolean): void;
    createDocument(client: Socket, documentData: any): Promise<any>;
    handleDisconnect(client: Socket): void;
}
