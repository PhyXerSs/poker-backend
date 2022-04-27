import { Controller, Delete, Get, Param, ParseEnumPipe, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('createroom/:name')
  async createRoom(@Param("name") name:string): Promise<string> {
    const roomname = await this.appService.createRoom(name);
    return roomname
  }

  @Post('member/:room/:name')
  async addMember(@Param('room') room:string , @Param('name') name:string): Promise<string> {
    const adding = await this.appService.addMember(room,name)
    return adding    
  }

  @Put('changename/:room/:memberid/:name')
  async changeName(@Param('room') room:string , @Param('memberid') memberid:string , @Param('name') name:string): Promise<string> {
    const changing_name = await this.appService.changeName(room,memberid,name);
    return changing_name
  }

  @Delete('member/:room/:memberid')
  async removeMember(@Param('room') room:string, @Param('memberid') memberid:string): Promise<string> {
    const deleting = this.appService.removeMember(room,memberid)
    return deleting
  }

  @Put('voting/:room/:memberid/:score')
  async votingScore(@Param('room') room:string , @Param('memberid') memberid:string , @Param('score') score:number): Promise<string> {
    const voting = await this.appService.votingScore(room,memberid,score)
    return voting
  }

  @Get('average/:room')
  async getAverageScore(@Param('room') room:string): Promise<any> {
    const average = await this.appService.getAverageScore(room)
    return average[0] 
  }

}
