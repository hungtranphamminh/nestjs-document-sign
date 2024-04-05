export interface Document {
  signers: string[],
  content: DocumentContent,
  id?: string
}

export interface DocumentContent {
  title: string,
  description: string,
  createdAt: number
}

/*** PAIR DOCUMENT INTERFACES ***/
export interface PairDocumentContent {
  title: string | null;
  description: string | null;
  createdAt: number;
  fileContent: string | ArrayBuffer | null;
}

export interface User {
  address: string | null;
  signature: string | null;
}

export interface PairDocument {
  signer: User;
  owner: User;
  id: string;
  content: PairDocumentContent;
}

export interface SignPairDocument {
  signer: User;
  id: string
}
