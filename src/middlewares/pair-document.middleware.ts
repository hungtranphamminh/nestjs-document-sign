import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { DocumentsService } from 'src/modules/sign-doc/documents.services';
import { verifySolanaSignature } from 'src/utils/sign-doc/signature-actions';


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
    if (req.body.owner) {
      verifySolanaSignature(req.body.id, req.body.owner.signatureSolana, req.body.owner.address, res)
    }
    if (req.body.signer && req.body.signer.signature !== "") {
      verifySolanaSignature(req.body.id, req.body.signer.signatureSolana, req.body.signer.address, res)
    }
    next();
  }
}
