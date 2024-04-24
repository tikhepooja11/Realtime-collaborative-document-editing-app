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
var DocumentController_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentController = void 0;
const common_1 = require("@nestjs/common");
const document_service_1 = require("./document.service");
const document_dto_1 = require("./document.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const mongoose_1 = require("mongoose");
let DocumentController = DocumentController_1 = class DocumentController {
    constructor(documentService) {
        this.documentService = documentService;
        this.logger = new common_1.Logger(DocumentController_1.name);
    }
    async getAllDocuments() {
        this.logger.log(`document-controller - getAllDocuments`);
        return await this.documentService.getAllDocuments();
    }
    async getDocumentById(id) {
        this.logger.log(`Fetching document with id hello: ${id}`);
        if (!(0, mongoose_1.isValidObjectId)(id)) {
            throw new common_1.NotFoundException('Invalid document ID');
        }
        const document = await this.documentService.getDocumentById(id);
        if (!document) {
            throw new common_1.NotFoundException('Document not found');
        }
        return document;
    }
    async getDocumentsByUserId(userId) {
        this.logger.log(`document controller -  getDocumentsByUserId, ${userId}`);
        if (!(0, mongoose_1.isValidObjectId)(userId)) {
            throw new common_1.NotFoundException('Invalid userId ID... Please provide correct user Id');
        }
        const documents = await this.documentService.getDocumentsByUserId(userId);
        if (documents.length === 0) {
            this.logger.log(documents);
            throw new common_1.NotFoundException('Documents not found');
        }
        return documents;
    }
    async createDocument(documentDto) {
        return await this.documentService.createDocument(documentDto);
    }
    async updateDocument(id, updateDocumentDto, userId) {
        if (!updateDocumentDto || Object.keys(updateDocumentDto).length === 0) {
            throw new common_1.BadRequestException('Update document payload is empty');
        }
        return await this.documentService.updateDocument(id, updateDocumentDto, userId);
    }
    async deleteDocument(id) {
        this.logger.log(`inside deleteDocument : ${id}`);
        return await this.documentService.deleteDocument(id);
    }
    async deleteAllDocuments() {
        this.logger.log(`inside deleteAllDocuments `);
        await this.documentService.deleteAllDocuments();
    }
    async addCollaborator(collaboratorsData) {
        const { sharedBy, sharedWith, documentId } = collaboratorsData;
        this.logger.log('\n' + sharedBy + '\n' + sharedWith + '\n' + documentId);
        const collaboratorsList = await this.documentService.addCollaborator(collaboratorsData);
        return collaboratorsList;
    }
    async getCollaborators(documentId) {
        return await this.documentService.getCollaborators(documentId);
    }
};
exports.DocumentController = DocumentController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "getAllDocuments", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "getDocumentById", null);
__decorate([
    (0, common_1.Get)('/getDocumentsByUserId/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "getDocumentsByUserId", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [document_dto_1.DocumentDto]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "createDocument", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, document_dto_1.UpdateDocumentDto, String]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "updateDocument", null);
__decorate([
    (0, common_1.Delete)('/deleteDocument/:id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "deleteDocument", null);
__decorate([
    (0, common_1.Delete)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "deleteAllDocuments", null);
__decorate([
    (0, common_1.Post)('/add-collaborator'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "addCollaborator", null);
__decorate([
    (0, common_1.Get)('/get-collaborators:documentId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DocumentController.prototype, "getCollaborators", null);
exports.DocumentController = DocumentController = DocumentController_1 = __decorate([
    (0, common_1.Controller)('documents'),
    __metadata("design:paramtypes", [document_service_1.DocumentService])
], DocumentController);
//# sourceMappingURL=document.controller.js.map