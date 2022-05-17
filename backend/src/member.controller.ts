import { Controller, Delete, Get, Param, Body , Post, Put } from '@nestjs/common';
import { MemberService } from './member.service';

@Controller('poker')
export class MemberController {
    constructor(private readonly memberService: MemberService) {}

    @Post('member/:room/:name')
    async addMember(@Param('room') room:string , @Param('name') name:string): Promise<string[]> {
      const adding = await this.memberService.addMember(room,name)
      return adding    
    }
  
    @Delete('member/:room/:memberid')
    async removeMember(@Param('room') room:string, @Param('memberid') memberid:string): Promise<string> {
      const deleting = this.memberService.removeMember(room,memberid)
      return deleting
    }

    @Put('changename/:room/:memberid/:name')
    async changeName(@Param('room') room:string , @Param('memberid') memberid:string , @Param('name') name:string): Promise<string> {
      const changing_name = await this.memberService.changeName(room,memberid,name);
      return changing_name
    }

    @Put('voting/:room/:memberid/:score')
    async votingScore(@Param('room') room:string , @Param('memberid') memberid:string , @Param('score') score:number): Promise<string> {
      const voting = await this.memberService.votingScore(room,memberid,score)
      return voting
    }
}