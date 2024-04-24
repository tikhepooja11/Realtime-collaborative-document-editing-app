"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.UserSchema = void 0;
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    documents: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Document' }],
    sharedWith: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Document' }],
    clientId: { type: String },
});
exports.UserModel = (0, mongoose_1.model)('User', exports.UserSchema);
//# sourceMappingURL=user.schema.js.map