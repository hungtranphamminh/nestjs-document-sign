import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Document, DocumentContent, PairDocument, SignPairDocument } from './interface/document.interface';
import { v4 as uuidv4 } from 'uuid';
import { InjectModel } from '@nestjs/mongoose';
import { Raw_Document } from './schemas/raw-document.schema';
import { Pair_Document } from './schemas/pair-document.schema';
import { Model } from 'mongoose';
import { retrieveDocDto } from './dto/documents.dto';
import { PDFDocument, PDFImage, degrees } from 'pdf-lib';
import { PairDocumentWSig, SignPairDocumentWSig } from './interface/documentV2.interface';
import { Pair_Document_W_Sig } from './schemas/pair-documentV2.schema';
import { addSignatureToPDF, retrieveDocumentWithId, verifySignatureSpace } from 'src/utils/sign-doc/pdf-actions';

/* TODO: add error handler */

@Injectable()
export class DocumentsService {

  constructor(
    @InjectModel(Raw_Document.name) private rawDocumentModel: Model<Raw_Document>,
    @InjectModel(Pair_Document.name) private pairDocumentModel: Model<Pair_Document>,
    @InjectModel(Pair_Document_W_Sig.name) private pairDocumentWSigModel: Model<Pair_Document_W_Sig>
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

  /** 
   * @description Create pair document with signature
    */
  async createPairWSig(doc: PairDocumentWSig) {
    let result
    try {
      /* draw the signature onto the pdf  */
      const modifiedPdf = await addSignatureToPDF(doc, 50, 50)

      let signedDoc = doc
      signedDoc.content.fileContent = modifiedPdf

      const newDoc = new this.pairDocumentWSigModel(signedDoc)
      result = await newDoc.save()
    }
    catch (error: any) {
      console.log("error: ", error)
      throw new HttpException(
        'There was a problem creating the document',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return { documentId: result.id }
  }

  /** 
   * @description Retrieve a pair contract by id
    */
  async getPairDocumentWSig({ id }: retrieveDocDto) {
    let result = await retrieveDocumentWithId(this.pairDocumentWSigModel, id)
    return result
  }

  /** 
   * @description Sign a pair contract by id
    */
  async signPairWSig(signPairInfo: SignPairDocumentWSig) {
    let documents = await retrieveDocumentWithId(this.pairDocumentWSigModel, signPairInfo.id)
    let pdfContent = documents[0].content.fileContent
    let ownerSignaturePos = [documents[0].owner.signaturePDF.position]

    if (!verifySignatureSpace(
      signPairInfo.signer.signaturePDF.position.x,
      signPairInfo.signer.signaturePDF.position.y,
      ownerSignaturePos)) {
      throw new BadRequestException('Invalid overlapped signature position')
    }

    let result
    try {
      /* draw the signature onto the pdf  */
      const modifiedPdf = await await addSignatureToPDF(
        pdfContent,
        signPairInfo.signer.signaturePDF.position.x,
        signPairInfo.signer.signaturePDF.position.y,
      )
      let signedDoc = documents[0]
      signedDoc.content.fileContent = modifiedPdf

      const newDoc = new this.pairDocumentWSigModel(signedDoc)
      result = await newDoc.save()
    }
    catch (error) {
      console.log("error: ", error)
      throw new HttpException(
        'There was a problem signing the document',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
    return "Both parties have reached an agreement on this contract!"
  }

}


