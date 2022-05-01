import { Injectable } from '@nestjs/common';
import firestore from './utils/firebase';
import 'firebase/compat/firestore';
import { member } from './dto/member.dto';
import { VoteData } from './dto/voteData.dto';
import { log } from 'console';
import { DataRearrange } from './dto/dataRerrange.dto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async createRoom(name: string): Promise<string> {
    var roomname = 'roomname'
    const DateInSec = new Date();
    const unixtime = DateInSec.valueOf()
    const DateInFormat = new Date(unixtime)

    const creator = {
      "name": name,
      "score": '-',
      "joinTime": DateInFormat
    }
    const issue = {
      "name": "Untitled",
      "score": '-',
      "history": [{ "CreateDate": [DateInFormat], "average_score": '-' }],
      "id" : '0',
      "selected" : Boolean(false)
    }

    await firestore.collection("poker").add({
      "createDate": DateInFormat,
      "status" : Number(1) 
    })
      .then(docs => {
        roomname = docs.id
        firestore.collection("poker").doc(docs.id).collection("members").add(creator)
        firestore.collection("poker").doc(docs.id).collection("issues").add(issue)
        .then(docs => {
            firestore.collection("poker").doc(roomname).update({'issues':[docs.id]})
        })
      })
    return roomname
  }

  async addMember(room: string, name: string): Promise<string> {
    const DateInSec = new Date();
    const unixtime = DateInSec.valueOf()
    const DateInFormat = new Date(unixtime)
    const newMember: member = { 'name': name, 'score': '-', 'joinTime': DateInFormat };
    var memberid = "xxx"
    const data = await firestore.collection("poker").doc(room).collection("members").add(newMember)
      .then(docs => {
        memberid = docs.id
      })
    return memberid
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
      'score': String(score),
    })
    //console.log(docs)
    return room + " member " + memberid + " vote " + score + "point "
  }
  async getAllIssue(room: string): Promise<{}> {
    let data = {}
    const snap = await firestore.collection("poker").doc(room).collection("issues").get()
    snap.forEach(docs => {
      data[docs.id] = { 'name': docs.data().name, 'average_score': docs.data().score }
    })
    return data
  }

  async getSpecificIssue(room: string, issue: string): Promise<{}> {
    let data = {}
    await firestore.collection("poker").doc(room).collection("issues").doc(issue).get()
      .then(docs => {
        console.log(docs.id, docs.data())
        data[docs.id] = docs.data()
      })
    return data
  }

  async createIssue(room: string,id:string ): Promise<string> {
    let issueid:string
    const DateInSec = new Date();
    const unixtime = DateInSec.valueOf()
    const DateInFormat = new Date(unixtime)
    firestore.collection("poker").doc(room).collection("issues").add({
      "name": 'Untitled',
      "score": '-',
      "selected": Boolean(false),
      'id': id,
      "history": [{ "CreateDate": [DateInFormat], "average_score": '-' }]
    }).then(async docs => {
      issueid = docs.id
      await firestore.collection("poker").doc(room).get()
      .then(async adddocs => {
        let newIssue = adddocs.data().issues as Array<string>
        newIssue.push(issueid)
        console.log(newIssue)
        await firestore.collection("poker").doc(room).update({
          'issues' : newIssue  
        })
      })
    })
    return issueid
  }

  async deleteIssue(room: string, issue: string): Promise<any> {
    return firestore.collection("poker").doc(room).collection("issues").doc(issue).delete()
  }

  async changeIssueName(room: string, issue: string, name: string): Promise<any> {
    firestore.collection("poker").doc(room).collection("issues").doc(issue).update({
      "name": name
    })
    return "Change Issue name of " + issue + ' to ' + name
  }

  async getAverageScore(room: string, issue: string, voteData: VoteData): Promise<any> {
    const data = await firestore.collection("poker").doc(room).collection("issues").doc(issue).get();
    await firestore.collection("poker").doc(room).collection("issues").doc(issue).update({
      "score": voteData.average_score,
      "history": data.data().history.push(voteData.members)
    })
  }

  async startNewVoting(room) {
    firestore.collection("poker").doc(room).collection('members').get()
      .then(snapShot => {
        snapShot.forEach(docs => {
          firestore.collection("poker").doc(room).collection('members').doc(docs.id).update({
            'score': '-',
          })
        })
      })
  }

  async setStatus(room, status) {
    await firestore.collection("poker").doc(room).collection('members').get()
      .then(snap => {
        snap.forEach(docs => {
          firestore.collection("poker").doc(room).update({
            'status': Number(status)
          })
        })
      })
      .then(async snaps => {
        if (status == 3) {
          let sum: number = 0
          let count: number = 0
          let stat = {}
          await firestore.collection("poker").doc(room).collection("members").get()
            .then(snaps => {
              snaps.forEach(docs => {
                //console.log(docs.data())
                if (docs.data().score !== '-') {
                  //console.log("-> " , docs.data())
                  if (docs.data().score in stat && docs.data().score >= 0) {
                    stat[docs.data().score].push(docs.data().name);
                  }
                  else {
                    stat[docs.data().score] = [docs.data().name];
                  }
                  sum += Number(docs.data().score);
                  count++;
                }
              })
            })

          const ret_data = { 'members': stat, 'average_score': sum / count }
          // firestore.collection("poker").doc(room).collection("issues").doc(issue).get()
          // .then(docs => {
          //   let history = docs.data().history as Array<{}>
          //   console.log(history)
          //   history.push(ret_data)
          //   firestore.collection("poker").doc(room).collection("issues").doc(issue).update({
          //     "score" : ret_data['average_score'],
          //     "history" : history
          //   })
          //   console.log(docs.data())
          // })
          console.log(ret_data)
        }
      })
  }

  async rearrangeIssue(room:string, data:DataRearrange) {
    let id_data = []
    Object.keys(data).forEach(key => {
      id_data.push(key)
      firestore.collection('poker').doc(room['room']).collection('issues').doc(key).update({
        "id" : data[key].id,
        'score' : data[key].score,
        "name" : data[key].title,
        "selected" : data[key].selected,
      })
    })
    firestore.collection('poker').doc(room['room']).update({
      "issues" : id_data
    })
  }



}

