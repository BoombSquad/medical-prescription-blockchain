import { Injectable } from '@nestjs/common';
import { Prescription } from './dto/Prescription';

@Injectable()
export class BlockchainService {

  createUserPrescription(prescription: Prescription) {

  }

  findUserPrescription(patientPb) {

  }

  startChain() {
    return "ok"
  }

}
