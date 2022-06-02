import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { WhiteboardController } from './whiteboard.controller';
import { WhiteboardService } from './whiteboard.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
  ],
  controllers: [WhiteboardController],
  providers: [WhiteboardService],
  exports: [WhiteboardService],

})
export class WhietbordModule {}
