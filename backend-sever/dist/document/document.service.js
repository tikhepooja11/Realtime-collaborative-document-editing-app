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
var DocumentService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_service_1 = require("../user/user.service");
console.log('DocumentService');
let DocumentService = DocumentService_1 = class DocumentService {
    constructor(userService, documentModel) {
        this.userService = userService;
        this.documentModel = documentModel;
        this.logger = new common_1.Logger(DocumentService_1.name);
        this.hasAccess = (userId, document) => {
            console.log('hasAccess userId: ' + userId);
            console.log(document.title + '\t' + document.userId);
            for (let i = 0; i < document.collaborators.length; i++) {
                if (userId === document.collaborators[i].toString()) {
                    console.log('yes collaborator is editing this document');
                    return true;
                }
            }
            return userId === document.userId.toString();
        };
    }
    async getAllDocuments() {
        return this.documentModel.find().exec();
    }
    async getDocumentById(id) {
        return await this.documentModel.findById(id).exec();
    }
    async getDocumentsByUserId(userId) {
        console.log('inside getDocumentsByUserId');
        const documents = await this.documentModel.find({ userId }).exec();
        console.log('documents');
        console.log(documents);
        return documents;
    }
    async createDocument(documentDto) {
        const { userId } = documentDto;
        const newDocument = new this.documentModel(documentDto);
        await newDocument.save();
        const user = await this.userService.getUserById(userId);
        const userDocuments = user?.documents;
        const updatedDocumentsList = [...userDocuments, newDocument];
        const updateUser = {
            documents: updatedDocumentsList,
        };
        await this.userService.updateUser(userId, updateUser);
        return newDocument;
    }
    async updateDocument(id, updateDocumentDto, userId) {
        const fetchDocument = await this.getDocumentById(id);
        if (!fetchDocument) {
            throw new common_1.NotFoundException('Document Not found');
        }
        return this.documentModel
            .findByIdAndUpdate(id, updateDocumentDto, { new: true })
            .exec();
    }
    async deleteDocument(id) {
        this.logger.log('Inside delete document' + id);
        await this.documentModel.findByIdAndDelete(id).exec();
    }
    async deleteAllDocuments() {
        await this.documentModel.deleteMany().exec();
    }
    async getCollaborators(documentId) {
        this.logger.log(`Getting collaborators for documentId : ${documentId}`);
    }
    async addCollaborator(collaboratorsData) {
        const { sharedBy: userId, sharedWith: collaboratorIds, documentId, } = collaboratorsData;
        const updateDocumentDto = {
            collaborators: collaboratorIds,
        };
        const document = await this.updateDocument(documentId, updateDocumentDto, userId);
        this.logger.log(`document: ${document.title} is updated with collaborators :${JSON.stringify(document)}`);
        const updateUserDto = {
            sharedWith: documentId,
        };
        const updateCollaboratorPromise = collaboratorIds.map((collaboratorId) => this.userService.updateUser(collaboratorId, updateUserDto));
        const updatedCollaboratorsData = await Promise.all(updateCollaboratorPromise);
        this.logger.log(updatedCollaboratorsData);
        return document?.collaborators;
    }
};
exports.DocumentService = DocumentService;
exports.DocumentService = DocumentService = DocumentService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)((0, common_1.forwardRef)(() => user_service_1.UserService))),
    __param(1, (0, mongoose_1.InjectModel)('Document')),
    __metadata("design:paramtypes", [user_service_1.UserService,
        mongoose_2.Model])
], DocumentService);
//# sourceMappingURL=document.service.js.map