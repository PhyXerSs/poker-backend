import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { IssueController } from './issue.controller';
import { IssueService } from './issue.service';
import { MemberController } from './member.controller';
import { MemberService } from './member.service';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [
    ScheduleModule.forRoot()
  ],
  controllers: [AppController , MemberController , IssueController],
  providers: [AppService , MemberService , IssueService],
})
export class AppModule {}
