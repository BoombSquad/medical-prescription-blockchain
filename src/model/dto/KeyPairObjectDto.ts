import base64url from 'base64url';

export class KeyPairObjectDto {
  t1: string;
  t2: string;

  constructor(privateKey: string, publicKey: string) {
    this.t1 = base64url.encode(privateKey, 'utf8');
    this.t2 = base64url.encode(publicKey, 'utf8');
  }
}
