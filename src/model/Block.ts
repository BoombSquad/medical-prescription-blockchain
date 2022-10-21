/* eslint-disable prettier/prettier */
import { SHA512 } from 'crypto-js';
import { Prescription } from './Prescription';

export class Block {

  private timeStamp: string;
  private prescriptions: Prescription;
  private previousHash: string;
  private hash: string;
  private nonce: number;

  constructor(timeStamp: string, prescriptions: Prescription, previousHash: string) {
    this.timeStamp = timeStamp;
    this.prescriptions = prescriptions;
    this.previousHash = previousHash;
    this.hash = this.caculateHash();
    this.nonce = 0; //Incremental number for generating new hashes without changing data
  }

  caculateHash() {
    return SHA512(
        this.timeStamp +
        JSON.stringify(this.prescriptions) +
        this.nonce +
        this.previousHash,
    ).toString();
  }
  
  mineBlock(difficulty: number) {
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')) {
      this.nonce++;
      this.hash = this.caculateHash();
    }
  }

  blockString(){
    const blockData = `
      timeStamp: ${this.timeStamp},
      prescriptions: {${this.prescriptions.toSting()}},
      previouHash: ${this.previousHash},
      hash: ${this.hash},
      nonce: ${this.nonce},`
    return blockData
  }

  public getPreviousHash(): string{
    return this.previousHash;
  }
  public getHash(): string{
    return this.hash;
  }

  public getPrescriptions(): Prescription{
    return this.prescriptions;
  }
}
