import { Injectable } from '@nestjs/common';
import firestore from './utils/firebase';
import 'firebase/compat/firestore';
import { VoteData } from './dto/voteData.dto';
import { nanoid } from 'nanoid'
import { DataRearrange } from './dto/dataRerrange.dto';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
  async deleteRoom(room:string) {
    firestore.collection('poker').doc(room).delete()
  }
  async createRoom(name: string): Promise<string> {
    var roomid = nanoid(6)
    const DateInSec = new Date();
    const unixtime = DateInSec.valueOf()
    const DateInFormat = new Date(unixtime)

    const creator = {
      "id" : '-',
      "name": name,
      "score": '-',
      "isHost": true
    }
    const issue = {
      "name": "Untitled",
      "score": '-',
      "history": [{ "CreateDate": [DateInFormat], "average_score": '-' }],
      "id" : '0',
      "selected" : Boolean(false)
    }
    
    await firestore.collection("poker").doc(roomid).set({
      "createDate": DateInFormat,
      "status" : Number(1) 
    })
      .then(async docs => {
        let creatorid = await firestore.collection("poker").doc(roomid).collection("members").add(creator)
        await firestore.collection("poker").doc(roomid).collection("members").get()
        .then(docs => {
          firestore.collection("poker").doc(roomid).collection("members").doc(creatorid.id).update({
          'id' : creatorid.id
          })
        })
        firestore.collection("poker").doc(roomid).collection("issues").add(issue)
        .then(docs => {
            firestore.collection("poker").doc(roomid).update({'issues':[docs.id]})
        })
      })
    return roomid
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

  async setStatus(room, issue , status) {
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

  async nestedDelete(room:string) {
    firestore.collection('poker').doc(room).collection('issues').get()
    .then(snap => {
      snap.forEach(docs => {
        firestore.collection('poker').doc(room).collection('issues').doc(docs.id).delete()
      })
    })

    firestore.collection('poker').doc(room).collection('members').get()
    .then(snap => {
      snap.forEach(docs => {
        firestore.collection('poker').doc(room).collection('members').doc(docs.id).delete()
      })
    })
    
    firestore.collection('poker').doc(room).delete()
  }

}

