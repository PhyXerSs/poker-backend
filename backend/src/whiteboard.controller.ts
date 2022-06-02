import { Controller, Delete, Get, Param, Body, Post, Put } from '@nestjs/common';
import { getegid } from 'process';
import { WhiteboardService } from './whiteboard.service';

const imageToBase64 = require('image-to-base64');

@Controller('whiteboard')
export class WhiteboardController {
  constructor(private readonly whiteboardService: WhiteboardService) { }

  @Post('createroom')
  async createRoom(@Body() data:{member:string , roomname:string}) {
    const create = this.whiteboardService.createRoom(data)
    return create
  }
  @Post('addmember/:room')
  async addMember(@Param('room') room:string , @Body() data:{member:string}) {
    const adding = this.whiteboardService.addMember(room,data)
    return adding
  }

  @Post('postit/:room') 
  async createPostit (@Param('room') room:string , @Body() data:{message:string , type:string , shape:string , color:string}) {
    const create = this.whiteboardService.createPostit(room,data)
    return create
  }

  @Put('postit/:room')
  async editPostit (@Param('room') room:string , @Body() data:{postitid:string , message:string , type:string , shape:string , color:string}) {    
    const editing = this.whiteboardService.editPostit(room,data)
    return editing
  }

  @Delete('deletepostit/:room')
  async deletePostit(@Param('room') room:string , @Body() data:{postitid:string}) {
    const deleting = this.whiteboardService.deletePostit(room,data)
    return deleting
  }
}
