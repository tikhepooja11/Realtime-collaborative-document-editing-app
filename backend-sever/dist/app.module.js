"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const socket_gateway_1 = require("./socket/socket.gateway");
const mongoose_1 = require("@nestjs/mongoose");
const auth_module_1 = require("./auth/auth.module");
const user_module_1 = require("./user/user.module");
const user_schema_1 = require("./user/user.schema");
const document_module_1 = require("./document/document.module");
const document_schema_1 = require("./document/document.schema");
const document_service_1 = require("./document/document.service");
const user_service_1 = require("./user/user.service");
const user_controller_1 = require("./user/user.controller");
const document_controller_1 = require("./document/document.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRoot(process.env.DATABASE_URL),
            auth_module_1.AuthModule,
            user_module_1.UserModule,
            document_module_1.DocumentModule,
            mongoose_1.MongooseModule.forFeature([
                { name: 'User', schema: user_schema_1.UserSchema },
                {
                    name: 'Document',
                    schema: document_schema_1.DocumentSchema,
                },
            ]),
        ],
        controllers: [app_controller_1.AppController, user_controller_1.UserController, document_controller_1.DocumentController],
        providers: [app_service_1.AppService, socket_gateway_1.SocketGateway, document_service_1.DocumentService, user_service_1.UserService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map