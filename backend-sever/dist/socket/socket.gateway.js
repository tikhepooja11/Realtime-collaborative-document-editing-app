"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const user_service_1 = require("../user/user.service");
const document_service_1 = require("../document/document.service");
let SocketGateway = class SocketGateway {
    constructor(userService, documentService) {
        this.userService = userService;
        this.documentService = documentService;
    }
    handleConnection(client) {
        console.log(`Socket-gateway User connected: ${client.id}`);
        client.on('userid-to-clientId-map', async (data) => {
            console.log('Socket -gateway inside userid map :' + JSON.stringify(data));
            const { fullname, email, clientId } = data;
            await this.userService.mapClientIdToUserId(fullname, email, clientId);
        });
    }
    handleJoinRoom(client, room) {
        console.log('join-room event received : ' + room);
        client.join(room);
        console.log(`User ${client.id} joined room ${room}`);
    }
    handleMessage(client, payload) {
        console.log('listening here in socket gatway');
        client
            .to(payload.room)
            .emit('received_message', { message: payload.message });
    }
    handleEditDocument(client, payload) {
        const { room, content } = payload;
        console.log(`User ${client.id} edited document in room ${room}`);
        client.to(room).emit('document-content-update', content);
    }
    async handleUserStartTyping(client, payload) {
        console.log('user start typing event received ath server side');
        const { roomId, fullname, email } = payload;
        console.log('room id :' + roomId);
        console.log('client id' + client.id);
        const user = await this.userService.mapClientIdToUserId(fullname, email, client.id);
        const userInfo = await this.userService.getClientInfoByClientId(client.id);
        client.to(roomId).emit('typing_indicator', {
            fullname: userInfo.fullname,
            isTyping: true,
        });
    }
    async handleUserStopTyping(client, payload) {
        const { roomId, fullname, email } = payload;
        const user = await this.userService.mapClientIdToUserId(fullname, email, client.id);
        const userInfo = await this.userService.getClientInfoByClientId(client.id);
        client.to(roomId).emit('typing_indicator', {
            fullname: userInfo.fullname,
            isTyping: false,
        });
    }
    handleUpdateStyleBold(client, bold) {
        console.log('inside bold : ' + bold);
        client.broadcast.emit('updateStyleBold', bold);
    }
    handleUpdateStyleItalic(client, italic) {
        client.broadcast.emit('updateStyleItalic', italic);
    }
    handleUpdateStyleUnderline(client, underline) {
        client.broadcast.emit('updateStyleUnderline', underline);
    }
    async createDocument(client, documentData) {
        console.log('Received new document:', documentData);
        await this.userService.mapClientIdToUserId(documentData.fullname, documentData.email, documentData.clientId);
        const user = await this.userService.getClientInfoByClientId(documentData.clientId);
        const userId = user._id;
        const modifiedDocumentData = {
            title: documentData.title,
            content: documentData.content,
            userId,
        };
        const document = await this.documentService.createDocument(modifiedDocumentData);
        console.log(`New Document created : ${document}`);
        this.server
            .to(documentData.clientId)
            .emit('save-document-success', document);
    }
    handleDisconnect(client) {
        console.log(`User disconnected: ${client.id}`);
    }
};
exports.SocketGateway = SocketGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SocketGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('join_room'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, String]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleJoinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('send_message'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('edit-document'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleEditDocument", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('user_start_typing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "handleUserStartTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('user_stop_typing'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "handleUserStopTyping", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateStyleBold'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Boolean]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleUpdateStyleBold", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateStyleItalic'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Boolean]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleUpdateStyleItalic", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('updateStyleUnderline'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Boolean]),
    __metadata("design:returntype", void 0)
], SocketGateway.prototype, "handleUpdateStyleUnderline", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('save-document'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], SocketGateway.prototype, "createDocument", null);
exports.SocketGateway = SocketGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: {
            origin: '*',
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
            'Access-Control-Allow-Origin': 'http://localhost:3001',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            allowedHeaders: [
                'Content-Type',
                'Origin',
                'X-Requested-With',
                'Accept',
                'Authorization',
            ],
            exposedHeaders: ['Authorization'],
            credentials: true,
        },
    }),
    __metadata("design:paramtypes", [user_service_1.UserService,
        document_service_1.DocumentService])
], SocketGateway);
//# sourceMappingURL=socket.gateway.js.map