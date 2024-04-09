import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

export type DocumentDocument = Document & MongooseDocument;
@Schema({ _id: false })
export class Pair_Document_Content {
  @Prop({ type: String, required: true })
  title: string | null;

  @Prop({ type: String, required: true })
  description: string | null;

  @Prop({ type: String, required: true })
  fileContent: string | ArrayBuffer | null;
}

@Schema({ _id: false })
export class User {
  @Prop({ type: String, required: true })
  address: string | null;

  @Prop({ type: String, required: false })
  signature: string | null;
}

@Schema()
export class Pair_Document {
  @Prop({ type: User, required: true })
  signer: User;

  @Prop({ type: User, required: true })
  owner: User;

  @Prop({ type: String, required: true })
  id: string;

  @Prop({ type: Pair_Document_Content, required: true })
  content: Pair_Document_Content;
}

export const PairDocumentSchema = SchemaFactory.createForClass(Pair_Document);
