import { Module } from "@nestjs/common";
import { EnvironmentModule } from "environment/environment.module";
import { FileSystemModule } from "features/file-system/file-system.module";
import { RegistryService } from "integrations/registry/registry.service";

@Module({
  imports: [
    EnvironmentModule,
    FileSystemModule,
  ],
  providers: [RegistryService],
  exports: [RegistryService],
})
export class RegistryModule {}
