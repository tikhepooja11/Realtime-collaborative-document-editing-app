// import * as mongoose from 'mongoose';

// export const UserSchema = new mongoose.Schema({
//   username: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
// });

// export interface User extends mongoose.Document {
//   id: string;
//   username: string;
//   password: string;
//   email: string;
// }

// export const UserModel = mongoose.model<User>('User', UserSchema);

import mongoose, { Schema, Document, model } from 'mongoose';
import { DocumentSchema, IDocument } from 'src/document/document.schema';
export interface User extends Document {
  fullname: string;
  email: string;
  password: string;
  documents: [IDocument];
  clientId: string;
  sharedWith: [IDocument];
}

export const UserSchema: Schema<User> = new Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  documents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Document' }],
  clientId: { type: String },
});

export const UserModel = model<User>('User', UserSchema);

// documents: string[]; // Array of document IDs

// documents: [{ type: Schema.Types.ObjectId, ref: 'Document' }],
