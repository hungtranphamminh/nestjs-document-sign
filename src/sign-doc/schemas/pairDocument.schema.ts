import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

export type DocumentDocument = Document & MongooseDocument;

@Schema()
export class Pair_Document_Content {
  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  createdAt: number;

  @Prop()
  fileContent: string;
}

@Schema()
export class Pair_Document {
  @Prop()
  signers: string;

  @Prop()
  owner: string;

  @Prop()
  content: Pair_Document_Content;

  @Prop()
  id: string;
}

export const PairDocumentSchema = SchemaFactory.createForClass(Pair_Document);
