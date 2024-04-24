"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentModel = exports.DocumentSchema = void 0;
const mongoose = require("mongoose");
exports.DocumentSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    title: { type: String, required: true },
    content: { type: String, default: '' },
    collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});
exports.DocumentModel = mongoose.model('Document', exports.DocumentSchema);
//# sourceMappingURL=document.schema.js.map