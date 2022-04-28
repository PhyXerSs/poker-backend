import { Injectable } from '@nestjs/common';
import firestore from './utils/firebase';
import 'firebase/compat/firestore';
import { member } from './dto/member.dto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async createRoom(name: string): Promise<string> {
    var roomname = 'roomname'

    const creator = {
      "name": name,
      "score": 0,
      "status": 'inactive',
    }
    const DateInSec = new Date();
    const unixtime = DateInSec.valueOf()
    const DateInFormat = new Date(unixtime)
    const issue = {
      "name": "Untitled",
      "score": '-',
      "history" : [{"CreateDate": [DateInFormat] , "average_score": '-'}]
    }
    const room = await firestore.collection("poker").add({
      "createDate": DateInFormat
    })
      .then(docs => {
        roomname = docs.id
        firestore.collection("poker").doc(docs.id).collection("members").add(creator)
        firestore.collection("poker").doc(docs.id).collection("issues").add(issue)
      })
    return roomname
  }

  async addMember(room: string, name: string): Promise<string> {
    const newMember: member = { 'name': name, 'score': 0, 'status': 'inactive' };
    const data = await firestore.collection("poker").doc(room).collection("members").add(newMember)
    return "Add member " + name + " to " + room
  }

  async removeMember(room: string, memberid: string): Promise<string> {
    const docs = firestore.collection("poker").doc(room).collection("members").doc(memberid).delete()
    return "Remove memberid " + memberid + " from room " + room
  }

  async changeName(room: string, memberid: string, name: string): Promise<string> {
    const docs = firestore.collection("poker").doc(room).collection("members").doc(memberid).update({
      'name': name
    })
    return "Change name of memberid " + memberid + ' to ' + name
  }

  async votingScore(room: string, memberid: string, score: number): Promise<string> {
    const docs = firestore.collection("poker").doc(room).collection("members").doc(memberid).update({
      'score': score,
      'status': "active"
    })
    console.log(docs)
    return room + " member " + memberid + " vote " + score + "point "
  }
  async getAllIssue(room:string): Promise<{}> {
    let data = {}
    const snap = await firestore.collection("poker").doc(room).collection("issues").get()
    snap.forEach(docs => {
      data[docs.id] = {'name':docs.data().name , 'average_score':docs.data().score} 
    })
    return data
  }

  async getSpecificIssue(room:string,issue:string): Promise<{}> {
    let data = {}
    await firestore.collection("poker").doc(room).collection("issues").doc(issue).get()
    .then(docs => {
      console.log(docs.id,docs.data())
      data[docs.id] = docs.data()
    })
    return data
  }

  async addIssue(room:string): Promise<string> {
    const DateInSec = new Date();
    const unixtime = DateInSec.valueOf()
    const DateInFormat = new Date(unixtime)
    firestore.collection("poker").doc(room).collection("issues").add({
      "name" : 'Untitled',
      "score" : '-',
      "history" : [{"CreateDate": [DateInFormat] , "average_score": '-'}]
    })
    return 'Add new issue to room ' + room
  }

  async deleteIssue(room:string,issue:string): Promise<any> {
    return firestore.collection("poker").doc(room).collection("issues").doc(issue).delete()
  }

  async changeIssueName(room:string,issue:string,name:string): Promise<any> {
    firestore.collection("poker").doc(room).collection("issues").doc(issue).update({
      "name" : name
    })
  }

  async getAverageScore(room: string, issue: string): Promise<any> {
    let sum: number = 0
    let count: number = 0
    let stat = {}
    const snap = await firestore.collection("poker").doc(room).collection("members").get()
    snap.forEach(docs => {
      if (docs.data().status == 'active') {
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
    
    const ret_data = { 'members': stat, 'average_score': sum / count }
    firestore.collection("poker").doc(room).collection("issues").doc(issue).get()
    .then(docs => {
      let history = docs.data().history as Array<{}>
      console.log(history)
      history.push(ret_data)
      firestore.collection("poker").doc(room).collection("issues").doc(issue).update({
        "score" : ret_data['average_score'],
        "history" : history
      })
      console.log(docs.data())
    })
    console.log(ret_data)
    return [ret_data]
  }

}

