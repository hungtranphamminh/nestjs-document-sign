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

export interface PairDocument {
  owner: string,
  signer: string,
  content: PairDocumentContent,
  id?: string
}

export interface PairDocumentContent {
  title: string,
  description: string,
  createdAt: number
  fileContent: string | ArrayBuffer
}