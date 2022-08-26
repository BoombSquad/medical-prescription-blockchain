export class Prescription {
  
  private doctorPublicKey: string;
  private patiencePublicKey: string;
  private prescriptionData: string;
  private creationDate: Date;
  private expirationDate: Date;

  constructor(
    doctorPublicKey: string,
    patiencePublicKey: string,
    prescription: string,
    expirationDate: Date,
  ) {
    this.doctorPublicKey = doctorPublicKey;
    this.patiencePublicKey = patiencePublicKey;
    this.prescriptionData = prescription;
    this.creationDate = new Date();
    this.expirationDate = expirationDate;

  }

  verifyClientKey(patienceKey: string): boolean {
    return this.patiencePublicKey === patienceKey;
  }

  verifyKeyPair(patienceKey: string, doctorKey: string): boolean {
    return (
      this.patiencePublicKey === patienceKey &&
      this.doctorPublicKey === doctorKey
    );
  }

  getPatienceData(): string {
    return this.prescriptionData;
  }

  updatePatienceData(
    patienceKey: string,
    doctorKey: string,
    newPrescription: string,
  ): string {
    if (!this.verifyKeyPair(patienceKey, doctorKey)) {
      return 'Invalid transaction';
    } else {
      this.prescriptionData = newPrescription;
      return 'Successfully updated';
    }
  }

  verifyPrescriptionExpiration() {
    
    if(new Date() > this.expirationDate){
      return false;
    }
    else return true;
  }
}
