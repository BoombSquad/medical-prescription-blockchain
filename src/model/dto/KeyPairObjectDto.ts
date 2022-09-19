export class KeyPairObjectDto{
    t1: string;
    t2: string;

    constructor(privateKey: string, publicKey: string){
        privateKey = privateKey.split('\n').join('');
        publicKey = publicKey.split('\n').join('');
        this.t1 = privateKey.replace('-----BEGIN PRIVATE KEY-----','').replace('-----END PRIVATE KEY-----','');
        this.t2 = publicKey.replace('-----BEGIN PUBLIC KEY-----','').replace('-----END PUBLIC KEY-----','');
    }
}

//.replace('\n','').replaceAll('\r','')