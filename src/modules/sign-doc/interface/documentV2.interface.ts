/*** PAIR DOCUMENT INTERFACES ***/
export interface PairDocumentContentWSig {
  title: string | null;
  description: string | null;
  createdAt: number;
  fileContent: string | null;
}

export interface PDFPosition {
  x: number,
  y: number
}

export interface UserWSig {
  address: string | null;
  signatureSolana: string | null;
  signaturePDF: {
    content: string | null;
    position: PDFPosition
  }
}

export interface PairDocumentWSig {
  signer: UserWSig;
  owner: UserWSig;
  id: string;
  content: PairDocumentContentWSig;
}

export interface SignPairDocumentWSig {
  signer: UserWSig;
  id: string
}
