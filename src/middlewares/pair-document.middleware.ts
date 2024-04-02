import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { Keypair, PublicKey } from '@solana/web3.js';
import *  as nacl from 'tweetnacl';
import { DocumentsService } from 'src/sign-doc/documents.services';
import { decode } from 'bs58';
import { decodeUTF8 } from 'tweetnacl-util';

/** @description Middleware to validate the permission to sign a document  */
@Injectable()
export class DocumentAccessMiddleware implements NestMiddleware {
  constructor(private readonly documentService: DocumentsService) { }
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { signer, id } = req.body;
      // Retrieve the document by its ID
      const document = await this.documentService.getPairDocument({ id: id });
      // Check if the signer's address exists on the document
      if (!document || document[0].signer.address !== signer.address) {
        throw new Error('Access to document denied!');
      }
      next();
    } catch (err) {
      res.status(403).json({ message: err.message });
    }
  }
}

/** @description Middleware to validate a singer's signature  */
@Injectable()
export class SignatureValidationMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const { signer, id } = req.body;
      // Check if the request body contains a signer
      if (signer) {
        const { address, signature } = signer;
        // Convert the address to a PublicKey
        const publicKey = new PublicKey(address);

        console.log("address: ", address)
        console.log("signature: ", signature)
        console.log("id as message: ", id)

        /* test section */
        const keypair = Keypair.fromSecretKey(
          Uint8Array.from([
            174, 47, 154, 16, 202, 193, 206, 113, 199, 190, 53, 133, 169, 175, 31, 56,
            222, 53, 138, 189, 224, 216, 117, 173, 10, 149, 53, 45, 73, 251, 237, 246,
            15, 185, 186, 82, 177, 240, 148, 69, 241, 227, 167, 80, 141, 89, 240, 121,
            121, 35, 172, 247, 68, 251, 226, 218, 48, 63, 176, 109, 168, 89, 238, 135,
          ])
        );

        const message = "The quick brown fox jumps over the lazy dog";
        const messageBytes = decodeUTF8(message);

        const signatureTest = nacl.sign.detached(messageBytes, keypair.secretKey);
        const result = nacl.sign.detached.verify(
          messageBytes,
          signatureTest,
          keypair.publicKey.toBytes()
        );

        console.log(result);

        if (!result) {
          throw new Error('Invalid signature');
        }
      }

      next();
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}
