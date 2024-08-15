import { Module } from "@nestjs/common";
import { EnvironmentModule } from "environment/environment.module";
import { CryptoService } from "features/crypto/crypto.service";

@Module({
  imports: [
    EnvironmentModule,
  ],
  exports: [CryptoService],
  providers: [CryptoService],
})
export class CryptoModule { }
