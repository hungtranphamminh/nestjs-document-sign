import { HttpException, HttpStatus, NotFoundException } from "@nestjs/common";
import { Model } from "mongoose";
import { PDFDocument } from "pdf-lib";
import { PDFPosition, PairDocumentWSig } from "src/modules/sign-doc/interface/documentV2.interface";

/** 
 * @description draw the signature on top of the pdf with given position
  */
export async function addSignatureToPDF(doc: PairDocumentWSig, xPos: number, yPos: number): Promise<any> {
  /* retrieve raw pdf and signature base64 string data */
  const pdfBase64 = doc.content.fileContent.split(',')[1];
  const signatureBase64 = doc.owner.signaturePDF.content.split(',')[1];

  // Convert the base64 strings back to Buffers
  const pdfBytes = Buffer.from(pdfBase64, 'base64');
  const signatureBytes = Buffer.from(signatureBase64, 'base64');

  // Load the PDF
  const pdfDoc = await PDFDocument.load(pdfBytes);

  // Embed the signature image
  const signatureImage = await pdfDoc.embedPng(signatureBytes);

  // Get the first page of the PDF
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Draw the signature image on the first page
  firstPage.drawImage(signatureImage, {
    x: xPos,
    y: yPos,
    height: 90,
    width: 90
  });

  // Save the PDF
  const outputPdfBytes = await pdfDoc.save();
  const modifiedBase64Pdf = 'data:application/pdf;base64,' + Buffer.from(outputPdfBytes).toString('base64');

  return modifiedBase64Pdf;
}

/** 
 * @description verify if the proposed signature position overlaps any others
  */
export function verifySignatureSpace(xPos: number, yPos: number, othersSig: PDFPosition[]) {
  for (let i = 0; i < othersSig.length; i++) {
    if ((xPos <= othersSig[i].x + 90 && xPos >= othersSig[i].x) || (yPos <= othersSig[i].y + 90 && yPos >= othersSig[i].y))
      return false
  }
  return true
}

/** 
 * @description retrieve document with signature with id
  */
export async function retrieveDocumentWithId(model: Model<any>, id: string) {
  let result
  try {
    result = await model.find({ id: id }).exec()
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