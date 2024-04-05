/*** PAIR DOCUMENT INTERFACES ***/
export interface PairDocumentContentWSig {
  title: string | null;
  description: string | null;
  createdAt: number;
  fileContent: string | null;
}

export interface UserWSig {
  address: string | null;
  signatureSolana: string | null;
  signaturePDF: {
    content: string | null;
    position: {
      x: number,
      y: number
    }
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
