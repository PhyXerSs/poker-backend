import { Controller, Delete, Get, Param, Body , Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { DataRearrange } from './dto/dataRerrange.dto';
import { VoteData } from './dto/voteData.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('createroom/:name')
  async createRoom(@Param("name") name:string): Promise<string[]> {
    const roomname = await this.appService.createRoom(name);
    return roomname
  }

  @Delete(':room')
  async removeRoom(@Param('room') room:string ): Promise<string> {
    const deleting = this.appService.nestedDelete(room)
    return 'ok';
  }

  @Post('average/:room/:issue')
  async getAverageScore(@Param('room') room:string , @Param("issue") issue:string , @Body() voteData:VoteData): Promise<any> {
    const average = await this.appService.getAverageScore(room,issue,voteData)
    return average[0] 
  }

  @Put('newvoting/:room')
  async startNewVoting(@Param('room') room:string) {
    const starting = await this.appService.startNewVoting(room)
    return starting
  }

  @Put('setstatus/:room/:issue/:status')
  async setStatus(@Param('room') room:string , @Param('issue') issue:string , @Param('status') status:number) {
    const setting = await this.appService.setStatus(room,issue,status)
    return setting
  }

}
