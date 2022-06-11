import { Controller, Delete, Get, Param, Body, Post, Put } from '@nestjs/common';
import { WhiteboardService } from './whiteboard.service';

const imageToBase64 = require('image-to-base64');

@Controller('whiteboard')
export class WhiteboardController {
  constructor(private readonly whiteboardService: WhiteboardService) { }

  @Post('createcatagories')
  async createCatagories(@Body() data:{name:string}) {
    const creating = this.whiteboardService.createCatagories(data)
    return creating
  }

  @Post('createroom')
  async createRoom(@Body() data:{member:string , memberName:string ,catagorie:string , roomname:string}) {
    //console.log('creating');
    const creating = this.whiteboardService.createRoom(data)
    return creating
  }

  @Put('editcatagories')
  async editCatagories(@Body() data:{oldname:string , newname:string}) {
    const editing = this.whiteboardService.editCatagories(data)
    return editing
  }

  @Put('changecatagories')
  async changeCatagories(@Body() data:{room:string , from:string , to:string}) {
    const changing = this.whiteboardService.changeCatagories(data)
    return changing
  }

  @Post('deleteroom') 
  async deleteRoom(@Body() data:{catagorie:string , room:string}) {
    console.log('delete',data);
    
    const deleting = this.whiteboardService.deleteRoom(data)
    return deleting
  }

  @Post('deleteCatagories')
  async deleteCatagories(@Body() data:{catagories:string}) {
    console.log("->",data);
    
    const deleting = this.whiteboardService.deleteCatagories(data)
    return deleting
  }
  // @Post('addmember')
  // async addMember(@Body() data:{room:string , member:string}) {
  //   const adding = this.whiteboardService.addMember(data)
  //   return adding
  // }

  // @Delete('deletemember')
  // async deleteMember(@Body() data:{room:string , member:string}) {
  //   const deleting = this.whiteboardService.deleteMember(data)
  //   return deleting
  // }

  // @Post('postit/:room') 
  // async createPostit (@Param('room') room:string , @Body() data:{message:string , type:string , shape:string , color:string}) {
  //   const create = this.whiteboardService.createPostit(room,data)
  //   return create
  // }

  // @Put('postit/:room')
  // async editPostit (@Param('room') room:string , @Body() data:{postitid:string , message:string , type:string , shape:string , color:string}) {    
  //   const editing = this.whiteboardService.editPostit(room,data)
  //   return editing
  // }

  // @Delete('deletepostit/:room')
  // async deletePostit(@Param('room') room:string , @Body() data:{postitid:string}) {
  //   const deleting = this.whiteboardService.deletePostit(room,data)
  //   return deleting
  // }
}
