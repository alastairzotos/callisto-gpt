import { Injectable } from "@nestjs/common";
import * as aes from 'aes-js';
import { EnvironmentService } from "environment/environment.service";

@Injectable()
export class CryptoService {
  constructor(
    private readonly envService: EnvironmentService,
  ) {}

  encrypt(value: string) {
    if (value === undefined) {
      return '';
    }

    const key = this.getEncryptionKey();

    const bytes = aes.utils.utf8.toBytes(value);

    const aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(5));
    const encryptedBytes = aesCtr.encrypt(bytes);

    const encryptedHex = aes.utils.hex.fromBytes(encryptedBytes);

    return encryptedHex;
  }

  decrypt(cipher: string) {
    if (cipher === undefined) {
      return '';
    }
    
    const key = this.getEncryptionKey();

    const encryptedBytes = aes.utils.hex.toBytes(cipher);

    const aesCtr = new aes.ModeOfOperation.ctr(key, new aes.Counter(5));
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);

    const decryptedText = aes.utils.utf8.fromBytes(decryptedBytes);

    return decryptedText;
  }

  private getEncryptionKey() {
    return aes.utils.hex.toBytes(this.envService.get().aesKey);
  }
}

