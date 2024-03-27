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