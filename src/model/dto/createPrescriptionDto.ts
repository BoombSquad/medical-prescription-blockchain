export class CreatePresciptionDto {
  doctorPublicKey: string;
  patiencePublicKey: string;
  prescriptionData: string;
  prescriptionSignature: string;
  expirationDate: Date;
}
