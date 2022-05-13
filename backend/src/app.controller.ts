import { Controller, Delete, Get, Param, Body, Post, Put } from '@nestjs/common';
import { AppService } from './app.service';
import { DataRearrange } from './dto/dataRerrange.dto';
import { VoteData } from './dto/voteData.dto';
import { getegid } from 'process';
const imageToBase64 = require('image-to-base64');


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Post('base64')
  async test2(@Body() data:{url:string}): Promise<string> {
    const base64 = await imageToBase64(data.url) // Image URL
    return 'data:image/jpeg;base64,'+ base64
  }
  /*
var remoteimageurl = "https://example.com/images/photo.jpg"
var filename = "images/photo.jpg"

fetch(remoteimageurl).then(res => {
  return res.blob();
}).then(blob => {
    //uploading blob to firebase storage
  firebase.storage().ref().child(filename).put(blob).then(function(snapshot) {
    return snapshot.ref.getDownloadURL()
 }).then(url => {
   console.log("Firebase storage image uploaded : ", url); 
  }) 
}).catch(error => {
  console.error(error);
});
  */

  @Post('createroom/:name')
  async createRoom(@Param("name") name: string): Promise<string[]> {
    const roomname = await this.appService.createRoom(name);
    return roomname
  }

  @Delete(':room')
  async removeRoom(@Param('room') room: string): Promise<string> {
    const deleting = this.appService.nestedDelete(room)
    return 'ok';
  }

  @Post('average/:room/:issue')
  async getAverageScore(@Param('room') room: string, @Param("issue") issue: string, @Body() voteData: VoteData): Promise<any> {
    const average = await this.appService.getAverageScore(room, issue, voteData)
    return average[0]
  }

  @Put('newvoting/:room')
  async startNewVoting(@Param('room') room: string) {
    const starting = await this.appService.startNewVoting(room)
    return starting
  }

  @Put('setstatus/:room/:issue/:status')
  async setStatus(@Param('room') room: string, @Param('issue') issue: string, @Param('status') status: number) {
    const setting = await this.appService.setStatus(room, issue, status)
    return setting
  }

  @Post('startbreakdown/:room')
  async startBreakdown(@Param('room') room: string) {
    const message = await this.appService.startBreakdown(room);
    return message
  }
  @Post('stopbreakdown/:room')
  async stopBreakdown(@Param('room') room: string) {
    const message = await this.appService.stopBreakdown(room);
    return message
  }
  @Post('startVoting/:room')
  async startVoting(@Param('room') room: string) {
    const message = await this.appService.startVoting(room);
    return message
  }
  @Post('stopVoting/:room')
  async stopVoting(@Param('room') room: string) {
    const message = await this.appService.stopVoting(room);
    return message
  }
}
