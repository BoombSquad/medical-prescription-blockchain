import base64url from 'base64url';
import { publicEncrypt } from 'crypto';
import { writeFileSync } from 'fs';
import { join } from 'path';
import { Block } from './Block';
import { Prescription } from './Prescription';

export class BlockChain {
  private chain: Block[];
  private pendingPrescription: Prescription[];
  private difficulty: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingPrescription = [];
    this.difficulty = 1;
  }

  getChain(): Block[] {
    return this.chain;
  }

  createGenesisBlock() {
    return new Block(
      Date.now().toString(),
      new Prescription(null, null, null, null),
      '0',
    );
  }

  getAllPendingBlocks(): Prescription[] {
    return this.pendingPrescription;
  }

  getPendingChainLenth(): number {
    return this.pendingPrescription.length;
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  createPrescription(createPrescription: Prescription) {
    this.pendingPrescription.push(createPrescription);
    return 'success';
  }

  mineAllPendingPrescriptions(): string[] {
    let i = 0;
    const queueLengh = this.pendingPrescription.length;
    const hashArray: string[] = [];
    for (i; i < queueLengh; i++) {
      const block = new Block(
        Date.now().toString(),
        this.pendingPrescription[i],
        this.getLastBlock().getHash(),
      );
      block.mineBlock(this.difficulty);
      this.chain.push(block);
      writeDownBlock(block.blockString());
      hashArray.push(block.getHash());
    }
    this.pendingPrescription = [];

    //can be implemented to add reward transaction;

    return hashArray;
  }

  mineLastPendingPrescription(): string {
    const lastPrescription = this.pendingPrescription.pop();
    if (lastPrescription != undefined) {
      const block = new Block(
        this.getNowDate(),
        lastPrescription,
        this.getLastBlock().getHash(),
      );
      block.mineBlock(this.difficulty);
      this.chain.push(block);
      writeDownBlock(block.blockString());
      // this.difficulty++; // INCREASES DIFFICULT WHEN BLOCKS ARE ADDED

      return block.getHash();
    }
    return 'there are no blocks to mine';
  }

  private getNowDate(): string {
    const dateNow = new Date();
    let hourNow = dateNow.getHours();
    hourNow -= 3;
    dateNow.setHours(hourNow);
    return dateNow.toString();
  }

  getUserPrescriptions(clientKey: string): object[] {
    let index = 1;
    const array: object[] = [];
    for (const blocks of this.chain) {
      if (blocks.getPrescriptions() != null) {
        if (blocks.getPrescriptions().verifyClientKey(clientKey)) {
          if (blocks.getPrescriptions().verifyPrescriptionExpiration()) {
            const data = {
              id: index,
              prescription: blocks.getPrescriptions().getPatienceData(),
              signature: encryptPrescription(
                blocks.getPrescriptions().getPublicKey(),
                blocks.getPrescriptions().getPatienceData(),
              ),
            };
            array.push(data);
            index++;
          }
        }
      }
    }
    return array;
  }

  isChainValid(): string {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      if (currentBlock.getHash() !== currentBlock.caculateHash()) {
        return (
          '\n Invalid hash: ' +
          currentBlock.caculateHash() +
          '\n Correct hash: ' +
          currentBlock.getHash()
        );
      }
      if (currentBlock.getPreviousHash() !== previousBlock.getHash()) {
        return (
          '\n Invalid previous hash: ' +
          previousBlock.getHash() +
          '\n Correct previous hash: ' +
          currentBlock.getPreviousHash()
        );
      }
    }
    return 'valid';
  }

  getLenth(): number {
    return this.chain.length;
  }
}
function encryptPrescription(
  base64UrlPublicKey: string,
  prescription: string,
): string {
  const clientKey = base64url.decode(base64UrlPublicKey, 'utf8');
  const plaintext = Buffer.from(prescription, 'utf8');
  const encryptedPrescription = publicEncrypt(clientKey, plaintext);
  return encryptedPrescription.toString('hex');
}
function writeDownBlock(jsonBlock: string) {
  writeFileSync(join('', 'chainAudit.txt'), jsonBlock + ';', {
    flag: 'a+',
  });
}
