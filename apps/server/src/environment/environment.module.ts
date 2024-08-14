import { Module } from '@nestjs/common';
import { EnvironmentService } from 'environment/environment.service';

@Module({
  exports: [EnvironmentService],
  providers: [EnvironmentService],
})
export class EnvironmentModule {}
