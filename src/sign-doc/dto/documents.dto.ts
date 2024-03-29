import { DocumentContent, PairDocumentContent } from "../interface/document.interface"

export class documentActionDto {
  signers: string[]
  content: string
}

export class createDocumentDto {
  signers: string[]
  content: string
}

export class createRawDocDto {
  signers: string[]
  content: DocumentContent
}

export class retrieveDocDto {
  id: string
}

export class createPairDocDto {
  signer: string
  owner: string
  content: PairDocumentContent
}