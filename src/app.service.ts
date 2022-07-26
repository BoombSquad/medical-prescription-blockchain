/* eslint-disable no-var */
import { Injectable } from '@nestjs/common';
import { ec } from 'elliptic';
import { Block } from './model/Block';
import { BlockChain } from './model/Blockchain';
import { CreatePresciptionDto } from './model/dto/createPrescriptionDto';
import { UpdatePresciptionDto } from './model/dto/updatePrescriptionDto';
import { Prescription } from './model/Prescription';

@Injectable()
export class AppService {
  private blockChain: BlockChain = new BlockChain();

  getLenth(): number {
    return this.blockChain.getLenth();
  }

  ListToMine(): Prescription[] {
    return this.blockChain.getAllPendingBlocks();
  }

  getChain(): Block[] {
    return this.blockChain.getChain();
  }

  verifyListToMine(): string {
    return 'Pending to validate: ' + this.blockChain.getPendingChainLenth();
  }

  mineBlock(id: string): string {
    if (this.blockChain.getPendingChainLenth() <= 0) {
      return 'there is no block to mine';
    }
    const hash = this.blockChain.mineLastPendingPrescription();
    return 'Miner: ' + id + ' mined the block with hash: ' + hash;
  }

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

  addBlockToValidation(prescriptionDto: CreatePresciptionDto): string {
    const prescription = new Prescription(
      prescriptionDto.doctorPublicKey,
      prescriptionDto.patiencePublicKey,
      prescriptionDto.prescriptionData,
    );
    return this.blockChain.createPrescription(prescription);
  }

  generateClientKey(): string {
    var ecc = new ec('curve25519');
    var key1 = ecc.genKeyPair().getPrivate().toString();
    console.log('Generated client key: ' + key1);
    return key1;
  }

  listUserPrescriptions(clientKey: string): string[] {
    const validationMessage: string[] = [];
    validationMessage.push(this.blockChain.isChainValid());
    console.log(validationMessage);
    if (validationMessage[0] != 'valid') {
      return validationMessage;
    } else {
      return this.blockChain.getUserPrescriptions(clientKey);
    }
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
