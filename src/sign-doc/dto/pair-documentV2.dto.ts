
export class ContentWSigDto {
  title: string | null;
  description: string | null;
  fileContent: string | null;
  createdAt: number;
}

export class UserWSigDto {
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

export class createPairDocWSigDto {
  signer: UserWSigDto;
  owner: UserWSigDto;
  id: string;
  content: ContentWSigDto;
}

export class signPairDocWSigDto {
  signer: UserWSigDto;
  id: string;
}
