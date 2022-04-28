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

  @Put('changename/:room/:memberid/:name')
  async changeName(@Param('room') room:string , @Param('memberid') memberid:string , @Param('name') name:string): Promise<string> {
    const changing_name = await this.appService.changeName(room,memberid,name);
    return changing_name
  }
  
  @Post('member/:room/:name')
  async addMember(@Param('room') room:string , @Param('name') name:string): Promise<string> {
    const adding = await this.appService.addMember(room,name)
    return adding    
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

  @Get('average/:room/:issue')
  async getAverageScore(@Param('room') room:string , @Param("issue") issue:string): Promise<any> {
    const average = await this.appService.getAverageScore(room,issue)
    return average[0] 
  }

  @Get('issue/:room')
  async getAllIssue(@Param('room') room:string) {
    const getting = await this.appService.getAllIssue(room)
    return getting
  }

  @Get('issue/:room/:issue')
  async getSpecificIssue(@Param("room") room:string, @Param('issue') issue:string) {
    const getting = await this.appService.getSpecificIssue(room,issue)
    return getting
  }

  @Post('issue/:room')
  async addIssue(@Param('room') room:string): Promise<any> {
    const adding  = await this.appService.addIssue(room)
    return adding
  }

  @Delete('issue/:room/:issue')
  async deleteIssue(@Param('room') room:string , @Param("issue") issue:string): Promise<any> {
    const deleting = await this.appService.deleteIssue(room,issue)
    return deleting
  }

  @Put('issue/:room/:issue/:name')
  async changeIssueName(@Param('room') room:string , @Param("issue") issue:string , @Param("name") name:string) : Promise<any> {
    const deleting = await this.appService.changeIssueName(room,issue,name)
    return 
  }

  @Put('newvoting/:room')
  async startNewVoting(@Param('room') room:string) {
    const starting = await this.appService.startNewVoting(room)
    return 
  }

}
