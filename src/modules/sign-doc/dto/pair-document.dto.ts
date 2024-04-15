
export class ContentDto {
  title: string | null;
  description: string | null;
  fileContent: string | ArrayBuffer | null;
  createdAt: number;
}

export class UserDto {
  address: string | null;
  signature: string | null;
}

export class createPairDocDto {
  signer: UserDto;
  owner: UserDto;
  id: string;
  content: ContentDto;
}

export class signPairDocDto {
  signer: UserDto;
  id: string;
}
