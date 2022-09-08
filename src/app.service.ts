/* eslint-disable no-var */
import { Injectable } from '@nestjs/common';
import { SHA512 } from 'crypto-js';
import { Block } from './model/Block';
import { BlockChain } from './model/Blockchain';
import { CreatePresciptionDto } from './model/dto/createPrescriptionDto';
import { Prescription } from './model/Prescription';
import * as ecc from 'encryptoo';

@Injectable()
export class AppService {
  getPrescriptionHash(key: string, prescription: string): string {
    const hash = SHA512(key + ":" + prescription).toString();
    return hash
  }
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
  listUserPrescriptions(clientKey: string): object[] {
    const validationMessage: string[] = [];
    validationMessage.push(this.blockChain.isChainValid());
    // console.log(validationMessage);
    if (validationMessage[0] != 'valid') {
     
      return [{message: "Block isnt valid"}];
    } else {
      return this.blockChain.getUserPrescriptions(clientKey);
    }
  }

  generateClientKey(): string {
    const publicKey = ecc.init();
    const secret = ecc.getSecret(publicKey);
    var userPublicKey = SHA512(secret)
    return secret + " :::::: " + userPublicKey;
  }

  addBlockToValidation(prescriptionDto: CreatePresciptionDto): string {

    const prescription = new Prescription(
      prescriptionDto.doctorPublicKey,
      prescriptionDto.patiencePublicKey,
      prescriptionDto.prescriptionData,
      prescriptionDto.prescriptionHash,
      new Date(prescriptionDto.expirationDate)
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
  // updateUserPrescriptions({
  //   patiencePublicKey,
  //   doctorPublicKey,
  //   prescriptionId,
  //   newPrescriptionData,
  // }: UpdatePresciptionDto): string {
  //   this.blockChain.updateUserPrescriptions(
  //     patiencePublicKey,
  //     doctorPublicKey,
  //     prescriptionId,
  //     newPrescriptionData,
  //   );

  //   return '';
  // }
}
