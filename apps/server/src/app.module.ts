import { Module } from '@nestjs/common';
import { ChatModule } from './features/chat/chat.module';

@Module({
  imports: [ChatModule],
  exports: [ChatModule],
})
export class AppModule {}
