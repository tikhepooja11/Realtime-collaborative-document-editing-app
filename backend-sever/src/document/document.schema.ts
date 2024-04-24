import * as mongoose from 'mongoose';

export interface IDocument extends mongoose.Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: string;
  content: string;
  collaborators: [mongoose.Schema.Types.ObjectId];
}

export const DocumentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  title: { type: String, required: true },
  content: { type: String, default: '' },
  collaborators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], //      Array of user ids
});

export const DocumentModel = mongoose.model<IDocument>(
  'Document',
  DocumentSchema,
);
