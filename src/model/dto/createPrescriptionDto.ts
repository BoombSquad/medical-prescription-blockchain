export class CreatePresciptionDto {
  doctorPublicKey: string;
  patiencePublicKey: string;
  prescriptionData: string;
  prescriptionHash: string;
  expirationDate: Date;
}
