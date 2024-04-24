import {
  WebSocketGateway,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserService } from '../user/user.service';
import { DocumentService } from 'src/document/document.service';
import { DocumentDto } from 'src/document/document.dto';

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
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly userService: UserService,
    private readonly documentService: DocumentService,
  ) {}

  handleConnection(client: Socket) {
    console.log(`Socket-gateway User connected: ${client.id}`);
    // Assuming the client sends registration details upon connection
    client.on('userid-to-clientId-map', async (data) => {
      console.log('Socket -gateway inside userid map :' + JSON.stringify(data));
      const { fullname, email, clientId } = data;

      // Map user details with client ID (socket.id) in the database
      await this.userService.mapClientIdToUserId(fullname, email, clientId);
    });
  }

  @SubscribeMessage('join_room')
  handleJoinRoom(client: Socket, room: string) {
    console.log('join-room event received : ' + room);
    client.join(room);
    console.log(`User ${client.id} joined room ${room}`);
  }

  @SubscribeMessage('send_message')
  handleMessage(client: Socket, payload: { room: string; message: string }) {
    console.log('listening here in socket gatway');
    client
      .to(payload.room)
      .emit('received_message', { message: payload.message });
  }

  @SubscribeMessage('edit-document')
  handleEditDocument(
    client: Socket,
    payload: { room: string; content: string },
  ) {
    const { room, content } = payload;
    console.log(`User ${client.id} edited document in room ${room}`);
    client.to(room).emit('document-content-update', content);
  }

  @SubscribeMessage('user_start_typing')
  async handleUserStartTyping(
    client: Socket,
    payload: { roomId: string; fullname: string; email: string },
  ) {
    console.log('user start typing event received ath server side');
    const { roomId, fullname, email } = payload;
    console.log('room id :' + roomId);
    console.log('client id' + client.id);
    const user = await this.userService.mapClientIdToUserId(
      fullname,
      email,
      client.id,
    );
    const userInfo = await this.userService.getClientInfoByClientId(client.id);

    client.to(roomId).emit('typing_indicator', {
      fullname: userInfo.fullname,
      isTyping: true,
    });
  }

  @SubscribeMessage('user_stop_typing')
  async handleUserStopTyping(
    client: Socket,
    payload: { roomId: string; fullname: string; email: string },
  ) {
    const { roomId, fullname, email } = payload;
    const user = await this.userService.mapClientIdToUserId(
      fullname,
      email,
      client.id,
    );
    const userInfo = await this.userService.getClientInfoByClientId(client.id);
    client.to(roomId).emit('typing_indicator', {
      fullname: userInfo.fullname,
      isTyping: false,
    });
  }

  @SubscribeMessage('updateStyleBold')
  handleUpdateStyleBold(client: Socket, bold: boolean) {
    console.log('inside bold : ' + bold);
    client.broadcast.emit('updateStyleBold', bold); // Broadcast to all clients
  }

  @SubscribeMessage('updateStyleItalic')
  handleUpdateStyleItalic(client: Socket, italic: boolean) {
    client.broadcast.emit('updateStyleItalic', italic); // Broadcast to all clients
  }

  @SubscribeMessage('updateStyleUnderline')
  handleUpdateStyleUnderline(client: Socket, underline: boolean) {
    client.broadcast.emit('updateStyleUnderline', underline); // Broadcast to all clients
  }

  @SubscribeMessage('save-document')
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

    // // Use documentData to create a new document in your service
    const modifiedDocumentData: DocumentDto = {
      title: documentData.title,
      content: documentData.content,
      userId,
    };
    const document =
      await this.documentService.createDocument(modifiedDocumentData);
    console.log(`New Document created : ${document}`);
    this.server
      .to(documentData.clientId)
      .emit('save-document-success', document);
    // Emit 'new-document-created' event to all connected clients with the created document
    // this.server.emit('new-document-created', { document, statusCode: 201 });
  }

  handleDisconnect(client: Socket) {
    console.log(`User disconnected: ${client.id}`);
  }
}
