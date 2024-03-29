import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Document, DocumentContent, PairDocument, SignPairDocument } from './interface/document.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Raw_Document } from './schemas/rawDocument.schema';
import { Pair_Document } from './schemas/pairDocument.schema';
import { Model } from 'mongoose';
import { retrieveDocDto } from './dto/documents.dto';


/* TODO: add error handler */

@Injectable()
export class DocumentsService {

  constructor(
    @InjectModel(Raw_Document.name) private rawDocumentModel: Model<Raw_Document>,
    @InjectModel(Pair_Document.name) private pairDocumentModel: Model<Pair_Document>
  ) { }

  private readonly docs: Document[] = [];
  private readonly rawDocs: Document[] = [];

  create(doc: Document) {
    this.docs.push(doc);
  }

  /* find all documents */
  findAll(): { fDocs: Document[], rDocs: Document[] } {
    return { fDocs: this.docs, rDocs: this.rawDocs };
  }

  /* find all related document */
  findAllRelated(signer: string): Document[] {
    return this.docs
  }



  /** @description retrieve raw message by id */
  async retrieveRawMessage({ id }: retrieveDocDto) {
    let result
    try {
      result = await this.rawDocumentModel.find({ id: id }).exec()
    }
    catch (error: any) {
      throw new HttpException(
        'There was a problem retrieving the document',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    console.log("document retrieved: ", result)
    return result
  }

  /** @description Create raw message to sign */
  async createRaw(doc: Document) {
    let docWithId: Document = { ...doc }
    docWithId.id = uuidv4()

    const newDoc = new this.rawDocumentModel(docWithId)
    let result
    try {
      result = await newDoc.save()
      this.rawDocs.push(result)
    }
    catch (error: any) {
      throw new HttpException(
        'There was a problem creating the document',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return { documentId: result.id }
  }

  /*** PAIR DOCUMENT SERVICES ***/


  /** 
   * @description Create a pair contract to sign
    */
  async createPair(doc: PairDocument) {
    const newDoc = new this.pairDocumentModel(doc)
    let result
    try {
      result = await newDoc.save()
    }
    catch (error: any) {
      throw new HttpException(
        'There was a problem creating the document',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return { documentId: result.id }
  }

  /** 
   * @description Sign a pair contract by id
    */
  async signPair(signPairInfo: SignPairDocument) {
    let updatedDocument
    try {
      updatedDocument = await this.pairDocumentModel.updateOne(
        { id: signPairInfo.id },
        { $set: { 'signer.signature': signPairInfo.signer.signature } },
      );

      if (updatedDocument.nModified === 0) {
        throw new NotFoundException('Document not found or no change made');
      }
    }
    catch (error: any) {
      throw new HttpException(
        'There was a problem retrieving the document',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return "Both parties have reached an agreement on this contract!"
  }

  /** 
   * @description Retrieve a pair contract by id
    */
  async getPairDocument({ id }: retrieveDocDto) {
    let result
    try {
      result = await this.pairDocumentModel.find({ id: id }).exec()
      if (result.length === 0) throw new NotFoundException('Document not found or no change made');
    }
    catch (error: any) {
      throw new HttpException(
        'There was a problem retrieving the document',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return result
  }

}
