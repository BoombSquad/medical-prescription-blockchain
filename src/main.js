const SHA256 = require('crypto-js/SHA256')

class Prescription {
    constructor(doctorPublicKey, patiencePublicKey, prescription) {
        this.doctorPublicKey = doctorPublicKey;
        this.patiencePublicKey = patiencePublicKey
        this.prescriptionData = prescription;
    }
}

class Block {

    constructor(timeStamp, prescriptions, previousHash) {
        this.timeStamp = timeStamp;
        this.prescriptions = prescriptions;
        this.previousHash = previousHash;
        this.hash = this.caculateHash();
        this.nonce = 0; //Incremental number for generating new hashes without changing data

    }

    caculateHash() {
        return SHA256(this.timeStamp + JSON.stringify(this.prescriptions) + this.nonce + this.previousHash).toString();
    }
    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;

            // console.log("Mining block...: " + this.hash) //For understanding the calculation
            this.hash = this.caculateHash()
        }
        console.log("Block mined: " + this.hash + "\n" + "With nonce of : " + this.nonce + "\n")
    }
}

class BlockChain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.pendingPrescription = []
        this.reward = "" //Add some type of reward
        this.difficulty = 1;
    }
    createGenesisBlock() {
        return new Block(Date.now(), [], "0");
    }

    getLastBlock() {
        return this.chain[this.chain.length - 1];
    }

    createPrescription(createPrescription) {
        this.pendingPrescription.push(createPrescription)

    }

    //Can recieve rewards
    mineAllPendingPrescriptions() {
        for (let i = 0; i < this.pendingPrescription.length; i++) {

            let block = new Block(Date.now(), this.pendingPrescription[i], this.getLastBlock().hash)
            console.log(this.difficulty)
            block.mineBlock(this.difficulty)
            this.chain.push(block)
            this.difficulty++
        }

        console.log("All Prescriptions validated" + "\n")

        this.pendingPrescription = [
            //can add reward transaction;
        ]
    }

    getUserPrescriptions(client) {
        let userMeds = []
        let i = 0;
        for (const blocks of this.chain) {
            if (blocks.prescriptions.patiencePublicKey === client) {
                userMeds.push(blocks.prescriptions.prescriptionData)
            }
        }
        return userMeds
    }
    /*
    addBlock(newBlock) {
        newBlock.previousHash = this.getLastBlock().hash
        newBlock.mineBlock(this.chain.length)
        this.chain.push(newBlock)
    }
    */

    isChainValid() {
        

        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];
            console.log(currentBlock.hash)
            console.log(currentBlock.caculateHash())
            if (currentBlock.hash !== currentBlock.caculateHash()) {
                console.log("\n Invalid hash: " + currentBlock.caculateHash() + "\n Correct hash: " + currentBlock.hash)
                return false
            }
            if (currentBlock.previousHash !== previousBlock.hash) {
                console.log("\n Invalid previous hash: " + previousBlock.hash + "\n Correct previous hash: " + currentBlock.previousHash)
                return false
            }
        }
        return true

    }

}

let blockchain = new BlockChain()


blockchain.createPrescription(new Prescription("doctorKey1", "patienceKey1", "paracetamol 1mg"))
blockchain.createPrescription(new Prescription("doctorKey2", "patienceKey3", "codein 1mg"))
blockchain.createPrescription(new Prescription("doctorKey3", "patienceKey1", "decah 1mg"))
blockchain.createPrescription(new Prescription("doctorKey2", "patienceKey1", "cataflan 1mg"))
console.log("MiningBlocks ... " + "\n")

blockchain.mineAllPendingPrescriptions()
console.log("\n")

console.log(blockchain)
console.log(blockchain.getUserPrescriptions("patienceKey1"))

console.log(blockchain.isChainValid())
blockchain.chain[1].prescriptions.push(new Prescription("dk1", "pk1", "cocaina 5kg"))
console.log(blockchain.getUserPrescriptions("patienceKey1"))
console.log(blockchain.isChainValid())

// for (const blocks of blockchain.chain) {
//     console.log(blocks.prescriptions.prescriptionData)
// }