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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const common_1 = require("@nestjs/common");
const document_service_1 = require("./document.service");
const user_service_1 = require("../user/user.service");
let DocumentsGateway = class DocumentsGateway {
    constructor(documentsService, userService) {
        this.documentsService = documentsService;
        this.userService = userService;
    }
    handleMessage(clientmsg) {
        console.log('listening here in document gatway');
        this.server.emit('received_message', clientmsg);
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
        const document = await this.documentsService.createDocument(modifiedDocumentData);
        console.log(`New Document created : ${document}`);
        this.server
            .to(documentData.clientId)
            .emit('new-document-created', document);
    }
    async join(client, documentJoinRequest) {
        const { name, email, clientId, doumentTobeEdited } = documentJoinRequest;
        console.log('documentJoinRequest' + JSON.stringify(documentJoinRequest));
        console.log('doumentTobeEdited' + doumentTobeEdited);
    }
    broadcastChanges(clientId, content) {
        this.server.to(clientId).emit('sharing-requested-document', content);
    }
    async editDocument(client, editingDocumentData) {
        console.log('edit-document - gateway', editingDocumentData.documentContent);
        console.log('userid :' + editingDocumentData.clientId);
        console.log('documentId : ' + editingDocumentData.documentId);
        const { documentId, documentTitle, documentContent, clientId, name, email, } = editingDocumentData;
    }
    async joinRoom({ name, email, clientId, }) {
        console.log('Listening to join event from client');
        console.log(name);
        console.log(email);
        console.log(clientId);
        await this.userService.mapClientIdToUserId(name, email, clientId);
        return { success: true };
    }
    async typing(isTyping, client) {
        const clientName = await this.userService.getClientInfoByClientId(client.id);
        client.broadcast.emit('typing', { clientName, isTyping });
    }
    handleConnection(client) {
        console.log(`Documents gateway - Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        console.log(`Client disconnected: ${client.id}`);
    }
};
exports.DocumentsGateway = DocumentsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], DocumentsGateway.prototype, "server", void 0);
__decorate([
    (0, websockets_1.SubscribeMessage)('send message'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], DocumentsGateway.prototype, "handleMessage", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('new-document'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], DocumentsGateway.prototype, "createDocument", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('document-join-req'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], DocumentsGateway.prototype, "join", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('edit-document'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], DocumentsGateway.prototype, "editDocument", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('join'),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentsGateway.prototype, "joinRoom", null);
__decorate([
    (0, websockets_1.SubscribeMessage)('typing'),
    __param(0, (0, websockets_1.MessageBody)('isTyping')),
    __param(1, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Boolean, socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], DocumentsGateway.prototype, "typing", null);
exports.DocumentsGateway = DocumentsGateway = __decorate([
    (0, common_1.Injectable)(),
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
    __metadata("design:paramtypes", [document_service_1.DocumentService,
        user_service_1.UserService])
], DocumentsGateway);
//# sourceMappingURL=documents.gateway.js.map