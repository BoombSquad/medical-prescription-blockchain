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
    this.creationDate = this.getBrazilDateNow();
    this.expirationDate = expirationDate;
  }

  private getBrazilDateNow(): Date {
    const dateNow = new Date();
    let hourNow = dateNow.getHours();
    hourNow -= 3;
    dateNow.setHours(hourNow);
    console.log(dateNow);
    return dateNow;
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
    const dateNow = this.getBrazilDateNow();
    if (dateNow > this.expirationDate) {
      return false;
    } else return true;
  }
}
