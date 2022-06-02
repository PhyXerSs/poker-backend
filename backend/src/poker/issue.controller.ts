import { Controller, Delete, Get, Param, Body , Post, Put } from '@nestjs/common';
import { DataRearrange } from './dto/dataRerrange.dto';
import { IssueService } from './issue.service';

@Controller('poker')
export class IssueController {
    constructor(private readonly issueService: IssueService) {}

    @Get('issue/:room')
    async getAllIssue(@Param('room') room:string) {
      const getting = await this.issueService.getAllIssue(room)
      return getting
    }
  
    @Get('issue/:room/:issue')
    async getSpecificIssue(@Param("room") room:string, @Param('issue') issue:string) {
      const getting = await this.issueService.getSpecificIssue(room,issue)
      return getting
    }
  
    @Post('issue/:room/:id')
    async createIssue(@Param('room') room:string , @Param('id') id:string): Promise<any> {
      const adding  = await this.issueService.createIssue(room,id)
      return adding
    }
  
    @Delete('issue/:room/:issue')
    async deleteIssue(@Param('room') room:string , @Param("issue") issue:string): Promise<any> {
      const deleting = await this.issueService.deleteIssue(room,issue)
      return deleting
    }
  
    @Put('issue/:room/:issue/:name')
    async changeIssueName(@Param('room') room:string , @Param("issue") issue:string , @Param("name") name:string) : Promise<any> {
      const changing = await this.issueService.changeIssueName(room,issue,name)
      return changing
    }

    @Put('issue/:room')
    async rearrangeIssue(@Param() room:string,@Body() dataRearrange:DataRearrange) {
      console.log(dataRearrange)
      const rearranging = await this.issueService.rearrangeIssue(room,dataRearrange)
      return rearranging
    }
}