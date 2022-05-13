import { Injectable } from '@nestjs/common';
import firestore from './utils/firebase';
import 'firebase/compat/firestore';
import { member } from './dto/member.dto';
import database from './utils/database';
import { domainToASCII } from 'url';
@Injectable()
export class MemberService {

  async addMember(room: string, name: string): Promise<string[]> {
    const newMember: member = { 'id': '-', 'name': name, 'score': '-', 'isHost': false };
    var memberid = "-"
    try {
      const data = await firestore.collection("poker").doc(room).get()
      if (data.exists) {
        const user = await firestore.collection("poker").doc(room).collection("members").add(newMember);
        database.ref('status/' + user.id).set('online')
        await firestore.collection("poker").doc(room).collection("members").doc(user.id).update({
          "id": user.id
        })
        return [user.id, data.id, data.data()?.roomName] as string[]
      } else {
        return ['Invalid pin']
      }
    } catch (err) {
      return ['Invalid pin']
    }
  }

  async removeMember(roomid: string, memberid: string): Promise<string> {
    console.log(roomid, memberid)
    await firestore.collection("poker").doc(roomid).collection("members").doc(memberid).get()
    .then(docs => {
      if (docs.data().isHost) {
        firestore.collection("poker").doc(roomid).collection("members").where("id", "!=", docs.id).limit(1).get()
          .then(snap => {
            snap.forEach(mem => {
              console.log(mem.data())
              firestore.collection("poker").doc(roomid).collection("members").doc(mem.id).update({
                "isHost": true
              })
            })
          })
      }
    })
    await firestore.collection("poker").doc(roomid).collection("members").doc(memberid).delete()
    await firestore.collection("user").doc(memberid).delete()
    return "Remove memberid " + memberid + " from room " + roomid
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

  async nestedDelete(room: string) {
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

//run

async function removeMember(roomid: string, memberid: string) {
  await firestore.collection("poker").doc(roomid).collection("members").doc(memberid).get()
    .then(docs => {
      console.log(docs.exists)
      if (docs.exists && docs.data().isHost) {
        firestore.collection("poker").doc(roomid).collection("members").where("id", "!=", docs.id).limit(1).get()
          .then(snap => {
            snap.forEach(mem => {
              console.log(mem.data())
              firestore.collection("poker").doc(roomid).collection("members").doc(mem.id).update({
                "isHost": true
              })
            })
          })
      }

    })
  console.log("Pass This section")
  await firestore.collection("user").doc(memberid).delete()
  console.log("Pass This second section")
  await firestore.collection("poker").doc(roomid).collection("members").doc(memberid).delete()
  console.log("End section\n")
}

database.ref('status').on('value', (snap) => {
  snap.forEach(data => {
    const memberid = data.key
    const status = data.val()
    if (status === 'offline') {
      database.ref(`status/${memberid}`).remove()
      firestore.collection('user').doc(memberid).get()
      .then(docs => {
        if (docs.exists) {
          console.log(memberid)
          const roomid = docs.data().room
          removeMember(roomid, memberid)
        }
      })
    }
  })
}
)