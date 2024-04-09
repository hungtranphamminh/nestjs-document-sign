import { decode } from "bs58";
import { PublicKey } from "@solana/web3.js";
import *  as nacl from 'tweetnacl';
import { Response } from "express";
import { HttpException, HttpStatus } from "@nestjs/common";

export function verifySolanaSignature(messageString: string, signatureString: string, publicKeyString: string, res: Response) {
  try {
    // Convert the message into bytes
    let messageBytes = new TextEncoder().encode(messageString);

    // Decode the 58 string to a byte array
    let signatureBytes = decode(signatureString);

    console.log('Signature length:', signatureBytes.length);

    // Convert the public key string into a PublicKey object
    let publicKey = new PublicKey(publicKeyString);

    // Now you can pass these into the verification function
    let result = nacl.sign.detached.verify(messageBytes, signatureBytes, publicKey.toBuffer());

    if (result) {
    } else {
      throw new HttpException(
        "Unmatched signature and account's address(publickey)",
        HttpStatus.BAD_REQUEST
      );
    }
  }
  catch (error: any) {
    console.log("error: ", error)
    throw new HttpException(
      'The signature is invalid.',
      HttpStatus.BAD_REQUEST
    );
  }
}