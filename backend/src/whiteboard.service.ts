import { Injectable } from '@nestjs/common';
import 'firebase/compat/firestore';
import { nanoid } from 'nanoid'
import firestore from './utils/firebase';
import database from './utils/database';
@Injectable()
export class WhiteboardService {

  async createRoom(data: { member: string, roomname: string }) {
    var roomid = nanoid(6)
    try {
      await firestore.collection('whiteboard').doc(roomid).set({
        'roomname': data.roomname,
      })
    } catch (err) {
      console.log(err);

    }
    try {
      await firestore.collection('whiteboard').doc(roomid).collection('members').add({
        'name': data.member,
      })
    } catch (err) {
      console.log(err);

    }
  }

  async addMember(room: string, data: { member: string }) {
    try {
      await firestore.collection('whiteboard').doc(room).collection('members').add({
        'name': data.member,
      })
    } catch(err) {
      console.log(err);
    }
  }
  
  async createPostit(room: string, data: { message: string, type: string, shape: string, color: string }) {
    let id;
    try {
      await firestore.collection('whiteboard').doc(room).collection('postit').add({
        'message': data.message,
        'type': data.type,
        'shape': data.shape,
        'color' : data.color,
      }).then(docs => {
        id = docs.id
      })
    } catch (err) {
      console.log(err);

    }
    try { await database.ref(`whiteboard/${room}/${id}/x`).set("30"); } catch (err) {
      console.log(err);
    }
    try { await database.ref(`whiteboard/${room}/${id}/y`).set("30"); } catch (err) {
      console.log(err);
    }
    try { await database.ref(`whiteboard/${room}/${id}/sizex`).set("0"); } catch (err) {
      console.log(err);
    }
    try { await database.ref(`whiteboard/${room}/${id}/sizey`).set("0"); } catch (err) {
      console.log(err);
    }
  }

  async editPostit(room: string, data: { postitid:string , message: string, type: string, shape: string, color: string }) { 
    try {
      await firestore.collection('whiteboard').doc(room).collection('postit').doc(data.postitid).update({
        'message': data?.message,
        'type': data?.type,
        'shape': data?.shape,
        'color' : data?.color,
      })
    } catch (err) {
      console.log(err);
    }
  }

  async deletePostit(room: string, data: { postitid: string }) {
    await firestore.collection('whiteboard').doc(room).collection('postit').doc(data.postitid).get()
      .then(async docs => {
        if (docs.exists) {
          try {
            await firestore.collection('whiteboard').doc(room).collection('postit').doc(data.postitid).delete()
          } catch (err) {
            console.log(err);
          }
        }
      })
  }

}

