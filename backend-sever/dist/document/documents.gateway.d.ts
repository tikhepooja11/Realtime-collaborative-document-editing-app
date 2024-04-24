import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { DocumentService } from './document.service';
import { UserService } from 'src/user/user.service';
export declare class DocumentsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    private readonly documentsService;
    private readonly userService;
    server: Server;
    constructor(documentsService: DocumentService, userService: UserService);
    handleMessage(clientmsg: string): void;
    createDocument(client: Socket, documentData: any): Promise<any>;
    join(client: Socket, documentJoinRequest: any): Promise<void>;
    broadcastChanges(clientId: string, content: any): void;
    editDocument(client: Socket, editingDocumentData: any): Promise<any>;
    joinRoom({ name, email, clientId, }: {
        name: string;
        email: string;
        clientId: string;
    }): Promise<{
        success: boolean;
    }>;
    typing(isTyping: boolean, client: Socket): Promise<void>;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
}
