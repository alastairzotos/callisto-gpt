import { Module } from "@nestjs/common";
import { FileSystemService } from "features/file-system/file-system.service";

@Module({
  providers: [FileSystemService],
  exports: [FileSystemService],
})
export class FileSystemModule {}
