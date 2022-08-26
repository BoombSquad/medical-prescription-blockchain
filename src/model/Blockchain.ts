import { Block } from './Block';
import { Prescription } from './Prescription';

export class BlockChain {
  private chain: Block[];
  private pendingPrescription: Prescription[];
  private reward: string;
  private difficulty: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.pendingPrescription = [];
    this.reward = ''; //Add some type of reward
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
    // console.log('\n This prescription has been added : \n');
    // console.log(this.pendingPrescription);
    return 'success';
  }

  //Can recieve rewards
  mineAllPendingPrescriptions(): string {
    let i = 0;
    for (i; i < this.pendingPrescription.length; i++) {
      const block = new Block(
        Date.now().toString(),
        this.pendingPrescription[i],
        this.getLastBlock().getHash(),
      );
      // console.log(this.difficulty);
      block.mineBlock(this.difficulty);
      // console.log(block.getHash());
      this.chain.push(block);
      this.difficulty++;
    }

    // console.log('All Prescriptions validated' + '\n');

    this.pendingPrescription = [
      //can add reward transaction;
    ];
    return 'total of ' + i + 'Blocks';
  }

  mineLastPendingPrescription(): string {
    const lastPrescription = this.pendingPrescription.pop();
    if (lastPrescription != undefined) {
      const block = new Block(
        Date.now().toString(),
        lastPrescription,
        this.getLastBlock().getHash(),
      );
      block.mineBlock(this.difficulty);
      this.chain.push(block);
      this.difficulty++;

      // console.log('Prescription validated' + '\n');

      return block.getHash();
    }
    return 'there are no blocks to mine';
  }

  getUserPrescriptions(clientKey: string): string[] {
    const userMeds: string[] = [];
    let index = 1;
    for (const blocks of this.chain) {
      if (blocks.getPrescriptions() != null) {
        if (blocks.getPrescriptions().verifyClientKey(clientKey)) {
          if(blocks.getPrescriptions().verifyPrescriptionExpiration()){
            userMeds.push(
              'Prescription ' +
                index +
                ' ' +
                blocks.getPrescriptions().getPatienceData(),
            );
            index++;
          }
        }
      }
    }
    return userMeds;
  }

  isChainValid(): string {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];
      // console.log(currentBlock.getHash());
      // console.log(currentBlock.caculateHash());
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

  // updateUserPrescriptions(
  //   clientKey: string,
  //   doctorKey: string,
  //   blockChainIndex: number,
  //   newPrescription: string,
  // ): string {
  //   const block = this.chain[blockChainIndex];
  //   if (block != null && block.getPrescriptions().verifyClientKey(clientKey)) {
  //     return block
  //       .getPrescriptions()
  //       .updatePatienceData(clientKey, doctorKey, newPrescription);
  //   }
  // }
}
