import { Injectable } from '@nestjs/common';
import firestore from './utils/firebase';
import 'firebase/compat/firestore';
import { createRoomData } from './dto/createRoomData.dto';
import { member } from './dto/member.dto';
import { deepStrictEqual } from 'assert';
import { getHeapSnapshot } from 'v8';
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async createRoom(name:string): Promise<string> {
    var roomname = 'roomname'
    
    const creator = {
      "name": name ,
      "score": 0,
      "status":'inactive',
  }
    const room = await firestore.collection("poker").add({
      "?" : "???"
    })
    .then(docs => {
      roomname = docs.id
      firestore.collection("poker").doc(docs.id).collection("members").add(creator)
      })
    return roomname
  }

  async addMember(room:string,name:string): Promise<string> {
    const newMember:member = {'name':name,'score':0,'status':'inactive'};
    const data = await firestore.collection("poker").doc(room).collection("members").add(newMember)
    return "Add member " + name + " to " + room
  }

  async removeMember(room:string,memberid:string): Promise<string> {
    const docs = firestore.collection("poker").doc(room).collection("members").doc(memberid).delete()
    return "Remove memberid " + memberid + " from room " + room 
  }

  async changeName(room:string,memberid:string,name:string): Promise<string> {
    const docs = firestore.collection("poker").doc(room).collection("members").doc(memberid).update({
      'name' : name
    })
    return "Change name of memberid " + memberid + ' to ' + name  
  }

  async votingScore(room:string,memberid:string,score:number): Promise<string> {
    const docs = firestore.collection("poker").doc(room).collection("members").doc(memberid).update({
      'score' : score,
      'status' : "active"
    })
    console.log(docs)
    return room + " member " + memberid + " vote " + score + "point "
  }

  async getAverageScore(room:string): Promise<any> {
    let sum:number = 0
    let count:number = 0
    let stat = {}
    const snap = await firestore.collection("poker").doc(room).collection("members").get()
    snap.forEach(docs => {
        if(docs.data().status == 'active')
          {
            if (docs.data().score in stat) {
              stat[docs.data().score].push(docs.data().name);
            }
            else {
              stat[docs.data().score] = [docs.data().name];
            }
            sum += Number(docs.data().score);
            count++;
          }
        })
    const ret_data = {'members' : stat , 'average_score': sum/count}
    console.log(ret_data)
    return [ret_data]
  }

}

