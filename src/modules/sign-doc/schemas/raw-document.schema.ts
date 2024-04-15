import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

export type DocumentDocument = Document & MongooseDocument;

@Schema()
export class Document_Content {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  createdAt: number;
}

@Schema()
export class Raw_Document {
  @Prop([String])
  signers: string[];

  @Prop()
  content: Document_Content;

  @Prop()
  id: string;
}

export const RawDocumentSchema = SchemaFactory.createForClass(Raw_Document);
