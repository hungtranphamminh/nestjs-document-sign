import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document as MongooseDocument } from 'mongoose';

export type DocumentDocument = Document & MongooseDocument;

@Schema({ _id: false })
export class Document_Content_W_Sig {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  fileContent: string;

  @Prop({ type: Number, required: true })
  createdAt: number;
}

@Schema({ _id: false })
export class User_W_Sig {
  @Prop({ type: String, required: true })
  address: string | null;

  @Prop({ type: String, required: false })
  signatureSolana: string | null;

  @Prop({ type: Object, required: false })
  signaturePDF: {
    content: string | null;
    position: {
      x: number,
      y: number
    }
  };
}

@Schema()
export class Pair_Document_W_Sig {
  @Prop({ type: User_W_Sig, required: true })
  signer: User_W_Sig;

  @Prop({ type: User_W_Sig, required: true })
  owner: User_W_Sig;

  @Prop({ type: Document_Content_W_Sig, required: true })
  content: Document_Content_W_Sig;

  @Prop({ type: String, required: false })
  id?: string;
}

export const PairDocumentWSigSchema = SchemaFactory.createForClass(Pair_Document_W_Sig);
