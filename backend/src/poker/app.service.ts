import { Injectable } from '@nestjs/common';
import firestore from './utils/firebase';
import 'firebase/compat/firestore';
import { VoteData } from './dto/voteData.dto';
import { nanoid } from 'nanoid'
import database from './utils/database';
import { Cron } from '@nestjs/schedule';
@Injectable()
export class AppService {
  
  @Cron('0 0 * * * *')
  handleCron() {
    console.log("Run Check Active Room")
    this.checkActiveRoom(3600);
  }
  
  async checkActiveRoom(seconds:Number) {
    firestore.collection('poker').get()
    .then(snap => {
      snap.forEach(room => {
        const diffTimeInSec = (new Date().valueOf()/1000) - (room.data().ActiveDate.seconds)
        if(diffTimeInSec >= seconds) {
          this.nestedDelete(room.id)
        }
      })
    })
  }

  async deleteRoom(room:string) {
    firestore.collection('poker').doc(room).delete()
  }

  async createRoom(name: string): Promise<string[]> {
    var roomid = nanoid(6)
    var creatorid : any
    const DateInSec = new Date();
    const unixtime = DateInSec.valueOf()
    const DateInFormat = new Date(unixtime)
    var retdata = [roomid]
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
      "ActiveDate": DateInFormat,
      "status" : Number(1) 
    })
      .then(async docs => {
        creatorid = await firestore.collection("poker").doc(roomid).collection("members").add(creator)
        database.ref('/poker/status/' + creatorid.id).set('online')
        retdata.push(creatorid.id)
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
    return retdata
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

  
  
  async startBreakdown(room:string) {
    console.log("Start Breakdown")
    const DateInSec = new Date();
    const unixtime = DateInSec.valueOf()
    const DateInFormat = new Date(unixtime)
    firestore.collection('poker').doc(room).update({
      startBreakdown : DateInFormat
    })

    return "Start Breakdown"
  }

  async startVoting(room:string) {
    console.log("Start Voting")
    const DateInSec = new Date();
    const unixtime = DateInSec.valueOf()
    const DateInFormat = new Date(unixtime)
    firestore.collection('poker').doc(room).update({
      startVoting : DateInFormat
    })
    
    return "Start Voting"
  }
  
  async stopBreakdown(room:string) {
    console.log("Stop Breakdown")
    const startBD = (await firestore.collection("poker").doc(room).get()).data().startBreakdown.seconds
    const stopBD = new Date().valueOf()/1000
    const seconds = stopBD-startBD
    firestore.collection("poker").doc(room).update({
      breakdownTime : seconds
    })
    return "Stop Breakdown"
  }
  
  async stopVoting(room:string) {
    console.log("Stop Voting")
    const startBD = (await firestore.collection("poker").doc(room).get()).data().startVoting.seconds
    const stopBD = new Date().valueOf()/1000
    const seconds = stopBD-startBD
    const result = new Date(seconds * 1000).toISOString().slice(11, 19);
    firestore.collection("poker").doc(room).update({
      votingTime : seconds
    })
    return "Stop Voting"
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
        firestore.collection("user").doc(docs.id).delete()
      })
    })
    
    firestore.collection('poker').doc(room).delete()
    database.ref(`/poker/countdown/${room}`).remove()
    database.ref(`/poker/issue_counter/${room}`).remove()
    database.ref(`/poker/alert_user_event/${room}`).remove()
  }
}

