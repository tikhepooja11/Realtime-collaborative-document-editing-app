import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';
import { DocumentService } from './document.service';
import { IDocument } from './document.schema';
import { DocumentDto, UpdateDocumentDto } from './document.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
@WebSocketGateway({
  cors: {
    //Add your origins here
    origin: '*', // Allow WebSocket connections from this origin
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    // allowed headers
    'Access-Control-Allow-Origin': 'http://localhost:3001', // Specify your allowed origin
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    allowedHeaders: [
      'Content-Type',
      'Origin',
      'X-Requested-With',
      'Accept',
      'Authorization',
    ],
    // headers exposed to the client
    exposedHeaders: ['Authorization'],
    credentials: true, // Enable credentials (cookies, authorization headers) cross-origin
  },
})
export class DocumentsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly documentsService: DocumentService,
    private readonly userService: UserService,
  ) {}

  @SubscribeMessage('send message')
  handleMessage(@MessageBody() clientmsg: string): void {
    console.log('listening here in document gatway');

    this.server.emit('received_message', clientmsg);
  }

  // socket.on("send message", (clientmsg) => {
  //   //  sending clients msg to all
  //   // socket.broadcast.emit("received_message", clientmsg);

  //   //  sending clients message to only subscribed room clients
  //   socket.to(clientmsg.room).emit("received_message", clientmsg);
  // });

  @SubscribeMessage('new-document')
  async createDocument(client: Socket, documentData: any): Promise<any> {
    console.log('Received new document:', documentData);
    //  need to map everytime as client id changes everytime
    await this.userService.mapClientIdToUserId(
      documentData.fullname,
      documentData.email,
      documentData.clientId,
    );
    const user = await this.userService.getClientInfoByClientId(
      documentData.clientId,
    );
    const userId = user._id;

    // Use documentData to create a new document in your service
    const modifiedDocumentData: DocumentDto = {
      title: documentData.title,
      content: documentData.content,
      userId,
    };
    const document =
      await this.documentsService.createDocument(modifiedDocumentData);
    console.log(`New Document created : ${document}`);
    this.server
      .to(documentData.clientId)
      .emit('new-document-created', document);
    // Emit 'new-document-created' event to all connected clients with the created document
    // this.server.emit('new-document-created', { document, statusCode: 201 });
  }

  @SubscribeMessage('document-join-req')
  async join(client: Socket, documentJoinRequest: any) {
    const { name, email, clientId, doumentTobeEdited } = documentJoinRequest;
    console.log('documentJoinRequest' + JSON.stringify(documentJoinRequest));
    console.log('doumentTobeEdited' + doumentTobeEdited);

    // const documentId = doumentTobeEdited._id;
    // console.log(
    //   `Listening to join-for-document event ${JSON.stringify(document)}`,
    // );
    // console.log(
    //   `Client ${client.id} is joining room for document ${documentId}`,
    // );
    // await this.userService.mapClientIdToUserId(name, email, clientId);
    // const user = await this.userService.getClientInfoByClientId(client.id);
    // console.log(user);

    // // Join room for the specified document
    // client.join(documentId);

    // // Broadcast to room that a client has joined
    // // this.server.to(document._id).emit('document-join-req', document);

    // // Emit a message back to the client indicating successful join
    // client.emit('document-join-success', { documentId: documentId });

    // // Broadcast to room that a client has joined (excluding the joining client)
    // client.to(documentId).emit('document-join-notification', {
    //   userId: client.id,
    //   message: `User ${client.id} has joined the room for document ${documentId}`,
    // });

    // // await this.broadcastChanges(documentJoinRequest.clientId, documentData);
    // // this.server.emit('sharing-requested-document', documentData);

    // // this.server.emit('sharing-requested-document', { documentData });
  }

  broadcastChanges(clientId: string, content: any) {
    this.server.to(clientId).emit('sharing-requested-document', content);
  }

  @SubscribeMessage('edit-document')
  async editDocument(client: Socket, editingDocumentData: any): Promise<any> {
    console.log('edit-document - gateway', editingDocumentData.documentContent);
    console.log('userid :' + editingDocumentData.clientId);
    console.log('documentId : ' + editingDocumentData.documentId);
    // Update the document content in your database/service
    const {
      documentId,
      documentTitle,
      documentContent,
      clientId,
      name,
      email,
    } = editingDocumentData;

    // await this.userService.mapClientIdToUserId(name, email, clientId);
    // const user = await this.userService.getClientInfoByClientId(clientId);
    // console.log(user);
    // const userId = user._id;
    // const updateDocumentDto: UpdateDocumentDto = {
    //   title: documentTitle,
    //   content: documentContent,
    // };

    // try {
    //   const updatedDocument = await this.documentsService.updateDocument(
    //     documentId,
    //     updateDocumentDto,
    //     userId,
    //   );
    //   console.log(updatedDocument);

    //   // Broadcast the updated content to all clients in the same document room
    //   // client.broadcast.emit('edit-document', {
    //   //   editingDocumentId,
    //   //   editingDocumentContent,
    //   // });
    // } catch (error) {
    //   console.error(`Error updating document content: ${error.message}`);
    // }
  }

  @SubscribeMessage('join')
  async joinRoom(
    @MessageBody()
    {
      name,
      email,
      clientId,
    }: {
      name: string;
      email: string;
      clientId: string;
    },
  ) {
    console.log('Listening to join event from client');
    console.log(name);
    console.log(email);
    console.log(clientId);
    await this.userService.mapClientIdToUserId(name, email, clientId);
    return { success: true };
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    const clientName = await this.userService.getClientInfoByClientId(
      client.id,
    );
    client.broadcast.emit('typing', { clientName, isTyping });
  }

  handleConnection(client: Socket) {
    //     const clientId = client.handshake.query.clientId;
    //     client.join(documentId); // Join room for the specific document
    console.log(`Documents gateway - Client connected: ${client.id}`);
    // console.log(
    //   'client request details :  ' + JSON.stringify(client.handshake),
    // );
    // console.log('client data : ' + JSON.stringify(client.data));
    //     client.id; // Unique identifier for the client connection
    //     client.handshake; // Client handshake details (e.g., query parameters, headers)
    //     client.data; // Custom data associated with the client (can be set or accessed)
  }

  handleDisconnect(client: Socket) {
    // Handle disconnection
    console.log(`Client disconnected: ${client.id}`);
  }
}
