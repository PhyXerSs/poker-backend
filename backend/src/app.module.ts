import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { ScheduleModule } from '@nestjs/schedule';
import { WhiteboardController } from './whiteboard.controller';
import { WhiteboardService } from './whiteboard.service';
import { WhietbordModule } from './whiteboard.module';
@Module({
  imports: [
    ScheduleModule.forRoot(),
    WhietbordModule
  ],
  controllers: [AppController , MemberController , IssueController],
  providers: [AppService , MemberService , IssueService],
})
export class AppModule {}
