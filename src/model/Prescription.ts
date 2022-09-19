export class Prescription {
  private doctorPublicKey: string;
  private patiencePublicKey: string;
  private prescriptionData: string;
  private prescriptionSignature: string;
  private creationDate: Date;
  private expirationDate: Date;

  constructor(
    doctorPublicKey: string,
    patiencePublicKey: string,
    prescriptionData: string,
    expirationDate: Date,
  ) {
    this.doctorPublicKey = doctorPublicKey;
    this.patiencePublicKey = patiencePublicKey;
    this.prescriptionData = prescriptionData;
    this.creationDate = new Date();
    this.expirationDate = expirationDate;
  }

  verifyClientKey(patienceKey: string): boolean {
    return this.patiencePublicKey === patienceKey;
  }

  getPatienceData(): string {
    return this.prescriptionData;
  }
  getPublicKey(): string {
    return this.patiencePublicKey;
  }

  verifyPrescriptionExpiration() {
    if (new Date() > this.expirationDate) {
      return false;
    } else return true;
  }
}
