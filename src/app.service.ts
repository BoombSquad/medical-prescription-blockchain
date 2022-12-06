import { BadRequestException, Injectable } from '@nestjs/common';

import base64url from 'base64url';
import { generateKeyPairSync, privateDecrypt, publicEncrypt } from 'crypto';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

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
  auditHashFile(): string {
    return readFileSync(join('', 'audit.txt'), 'utf-8');
  }
  auditChainFile(): string {
    return readFileSync(join('', 'chainAudit.txt'), 'utf-8');
  }

  //TO CLIENT
  listUserPrescriptions(clientBase64Key: string): object[] {
    const validationMessage: string[] = [];
    validationMessage.push(this.blockChain.isChainValid());
    if (validationMessage[0] != 'valid') {
      return [{ message: 'Blockchain is corrupted' }];
    } else {
      return this.blockChain.getUserPrescriptions(clientBase64Key);
    }
  }

  addBlockToValidation(prescriptionDto: CreatePresciptionDto): string {
    try {
      verifyData(prescriptionDto);
    } catch (error) {
      return 'Not Valid DATA';
    }
    const prescription = new Prescription(
      prescriptionDto.doctorPublicKey,
      prescriptionDto.patiencePublicKey,
      prescriptionDto.prescriptionData,
      new Date(prescriptionDto.expirationDate),
    );

    return this.blockChain.createPrescription(prescription);
  }
  encryptPrescription(
    base64UrlPublicKey: string,
    prescription: string,
  ): string {
    const clientKey = base64url.decode(base64UrlPublicKey, 'utf8');
    const plaintext = Buffer.from(prescription, 'utf8');
    const encryptedPrescription = publicEncrypt(clientKey, plaintext);
    return encryptedPrescription.toString('hex');
  }

  //TO MINER

  mineAllBlock(id: string): string {
    if (this.blockChain.getPendingChainLenth() <= 0) {
      return 'there is no block to mine';
    }
    const hashArray = this.blockChain.mineAllPendingPrescriptions();
    hashArray.forEach((hash) => writeDown(hash));
    return id + ' mined a ' + 'total of ' + hashArray.length + ' blocks';
  }

  mineBlock(id: string): string {
    if (this.blockChain.getPendingChainLenth() <= 0) {
      return 'there is no block to mine';
    }
    const hash = this.blockChain.mineLastPendingPrescription();

    writeDown(hash);

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
      modulusLength: 4096,
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
function writeDown(hash: string) {
  writeFileSync(join('', 'audit.txt'), hash + ';', {
    flag: 'a+',
  });
}
function verifyData(prescriptionDto: CreatePresciptionDto) {
  if (
    isInvalid(prescriptionDto.doctorPublicKey) ||
    isInvalid(prescriptionDto.patiencePublicKey) ||
    isValidDate(new Date(prescriptionDto.expirationDate)) ||
    isInvalid(prescriptionDto.prescriptionData)
  ) {
    throw new BadRequestException('Invalid Prescription Dto');
  }
}
function isInvalid(raw: string) {
  if (raw == null || raw == '' || raw == ' ') {
    return true;
  }
}
function isValidDate(date: Date) {
  return !(date instanceof Date && !isNaN(date.getTime()));
}
