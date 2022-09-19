import { Injectable } from '@nestjs/common';

import base64url from 'base64url';
import { generateKeyPairSync, privateDecrypt } from 'crypto';

import { Block } from './model/Block';
import { BlockChain } from './model/Blockchain';
import { Prescription } from './model/Prescription';

import { CreatePresciptionDto } from './model/dto/createPrescriptionDto';
import { KeyPairObjectDto } from './model/dto/KeyPairObjectDto';

@Injectable()
export class AppService {
  private blockChain: BlockChain = new BlockChain();

  // TO CHAIN
  getLenth(): number {
    return this.blockChain.getLenth();
  }
  getChain(): Block[] {
    return this.blockChain.getChain();
  }
  ListToMine(): Prescription[] {
    return this.blockChain.getAllPendingBlocks();
  }

  //TO CLIENT
  listUserPrescriptions(clientBase64Key: string): object[] {
    const validationMessage: string[] = [];
    validationMessage.push(this.blockChain.isChainValid());
    // console.log(validationMessage);
    if (validationMessage[0] != 'valid') {
      return [{ message: 'Block isnt valid' }];
    } else {
      return this.blockChain.getUserPrescriptions(clientBase64Key);
    }
  }

  addBlockToValidation(prescriptionDto: CreatePresciptionDto): string {
    const prescription = new Prescription(
      prescriptionDto.doctorPublicKey,
      prescriptionDto.patiencePublicKey,
      prescriptionDto.prescriptionData,
      new Date(prescriptionDto.expirationDate),
    );

    return this.blockChain.createPrescription(prescription);
  }

  //TO MINER

  mineAllBlock(id: string): string {
    if (this.blockChain.getPendingChainLenth() <= 0) {
      return 'there is no block to mine';
    }
    return (
      'Miner: ' +
      id +
      ' mined a ' +
      this.blockChain.mineAllPendingPrescriptions()
    );
  }

  mineBlock(id: string): string {
    if (this.blockChain.getPendingChainLenth() <= 0) {
      return 'there is no block to mine';
    }
    const hash = this.blockChain.mineLastPendingPrescription();
    return 'Miner: ' + id + ' mined the block with hash: ' + hash;
  }

  verifyListToMine(): string {
    return 'Pending to validate: ' + this.blockChain.getPendingChainLenth();
  }

  //TO USE ON FRONT
  validatePrescription(
    base64UrlClientKey: string,
    prescriptionHex: string,
  ): string | PromiseLike<string> {
    const clientKey = base64url.decode(base64UrlClientKey, 'utf8');
    const buf = Buffer.from(prescriptionHex, 'hex');
    const decrypted = privateDecrypt(clientKey, buf);
    return decrypted.toString();
  }

  generateClientKey(): KeyPairObjectDto {
    const rsaParams = {
      modulusLength: 2048,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs1',
        format: 'pem',
      },
    };
    const { privateKey, publicKey } = generateKeyPairSync('rsa', rsaParams);
    return new KeyPairObjectDto(privateKey.toString(), publicKey.toString());
  }
}
