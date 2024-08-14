import { Injectable } from '@nestjs/common';
import { environment } from 'environment/environment';

@Injectable()
export class EnvironmentService {
  get() {
    return environment;
  }
}
