export class CreatePresciptionDto {
  doctorPublicKey: string;
  patiencePublicKey: string;
  prescriptionData: string;
  expirationDate: Date;
}
