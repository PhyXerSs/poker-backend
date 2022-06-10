import { Injectable } from '@nestjs/common';
import 'firebase/compat/firestore';
import { nanoid } from 'nanoid'
import firestore from './utils/firebase';
import database from './utils/database';
import { spawn } from 'child_process';
@Injectable()
export class WhiteboardService {

  async createCatagories(data: { name: string }) {
    let id;
    try {
      await firestore.collection('whiteboard').where('catagories', '==', data.name).limit(1).get()
        .then(snap => {
          if (snap.docs.length == 0) {
            firestore.collection('whiteboard').add({
              'catagories': data.name
            })
              .then(docs => {
                id = docs.id
              })
          }
        })
    }
    catch (err) {
      console.log(err);
    }
    return id;
  }

  async editCatagories(data: { oldname: string, newname: string }) {
    try {
      await firestore.collection('whiteboard').where('catagories', '==', data.newname).get()
        .then(snap => {
          if (snap.docs.length == 0) {
            console.log("Not have newname");

            firestore.collection('whiteboard').where('catagories', '==', data.oldname).get()
              .then(snap => {
                snap.forEach(docs => {
                  firestore.collection('whiteboard').doc(docs.id).update({
                    'categories': data.newname
                  })
                })
              })
            firestore.collection('whiteboard_room').where('catagories', '==', data.oldname).get()
              .then(snap => {
                snap.forEach(docs => {
                  firestore.collection('whiteboard_room').doc(docs.id).update({
                    'catagories': data.newname
                  })
                  database.ref(`retrospective/${docs.id}/roomDetail`).update({
                    'catagories' : data.newname
                  })
                })
              })
          }
        })
    } catch (err) {
      console.log(err);
    }
  }
  async changeCatagories(data: { room: string, from: string, to: string }) {
    let oldid, newid
    try {
      await firestore.collection('whiteboard').where('catagories', '==', data.from).limit(1).get()
        .then(snap => {
          snap.forEach(docs => {
            oldid = docs.id
          })
        })
      await firestore.collection('whiteboard').where('catagories', '==', data.to).limit(1).get()
        .then(snap => {
          snap.forEach(docs => {
            newid = docs.id
          })
        })
      console.log(oldid, newid);

      await firestore.collection('whiteboard').doc(oldid).collection('room').doc(data.room).get()
        .then(async docs => {
          await firestore.collection('whiteboard').doc(newid).collection('room').doc(data.room).set({
            "name": docs.data().name
          })
        })
      await firestore.collection('whiteboard').doc(oldid).collection('room').doc(data.room).delete()
      await firestore.collection('whiteboard_room').doc(data.room).update({
        "catagories": data.to
      })
    } catch (err) {
      console.log(err);

    }
  }
  async createRoom(data: { member: string, catagorie: string, roomname: string }) {
    var t = await String(new Date().valueOf())
    var roomid = t + nanoid(6)
    try {
      await firestore.collection('whiteboard').where('catagories', '==', data.catagorie).limit(1).get()
        .then(snap => {
          snap.forEach(async docs => {
            await firestore.collection('whiteboard').doc(docs.id).collection('room').doc(roomid).set({
              'name': data.roomname
            })
            await firestore.collection('whiteboard_room').doc(roomid).set({
              'roomname': data.roomname,
              'catagories': data.catagorie
            })
          })
        }
        )
      await database.ref(`retrospective/${roomid}/roomDetail`).set({
        'roomName': data.roomname,
        'roomImage': "",
        'createBy': data.member,
        'catagories': data.catagorie
      })
    } catch (err) {
      console.log(err);
    }
    return roomid
  }

  async deleteCatagories(data:{ catagories:string}) {
    await firestore.collection('whiteboard_room').where('catagories' , '==' , data.catagories).get()
    .then(snap => {
      snap.forEach(docs => {
        console.log(docs.id);
        this.deleteRoom({catagorie:data.catagories,room:docs.id})
      })
    })
    await firestore.collection('whiteboard').where('catagories', '==', data.catagories).get()
    .then(snap => {
      snap.forEach(docs => {
        firestore.collection('whiteboard').doc(docs.id).delete()
      })
    })
  }
  
  async deleteRoom(data: { catagorie: string, room: string }) {
    await firestore.collection('whiteboard_room').doc(data.room).get()
      .then(docs => {
        if (docs.exists) {
          firestore.collection('whiteboard_room').doc(data.room).delete()
          firestore.collection('whiteboard').where('catagories', '==', data.catagorie).get()
            .then(snap => {
              snap.forEach(docs => {
                firestore.collection('whiteboard').doc(docs.id).collection('room').doc(data.room).delete()
              })
            })
          database.ref(`retrospective/${data.room}`).remove()
        }
      })
  }

  // async addMember(data: { room: string, member: string }) {
  //   try {
  //     await firestore.collection('whiteboard_room').doc(data.room).get()
  //       .then(async docs => {
  //         if (docs.exists) {
  //           await firestore.collection('whiteboard_room').doc(data.room).collection('members').doc(data.member).set({
  //             'name': data.member,
  //           })
  //         }
  //       })
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // async deleteMember(data: { room: string, member: string }) {
  //   try {
  //     await firestore.collection('whiteboard_room').doc(data.room).collection('members').doc(data.member).delete()
  //   } catch (err) {
  //     console.log(err);

  //   }
  // }
  //   async createPostit(room: string, data: { message: string, type: string, shape: string, color: string }) {
  //   let id;
  //   try {
  //     await firestore.collection('whiteboard').doc(room).collection('postit').add({
  //       'message': data.message,
  //       'type': data.type,
  //       'shape': data.shape,
  //       'color': data.color,
  //     }).then(docs => {
  //       id = docs.id
  //     })
  //   } catch (err) {
  //     console.log(err);

  //   }
  //   try { await database.ref(`whiteboard/${room}/${id}/x`).set("30"); } catch (err) {
  //     console.log(err);
  //   }
  //   try { await database.ref(`whiteboard/${room}/${id}/y`).set("30"); } catch (err) {
  //     console.log(err);
  //   }
  //   try { await database.ref(`whiteboard/${room}/${id}/sizex`).set("0"); } catch (err) {
  //     console.log(err);
  //   }
  //   try { await database.ref(`whiteboard/${room}/${id}/sizey`).set("0"); } catch (err) {
  //     console.log(err);
  //   }
  // }

  //   async editPostit(room: string, data: { postitid: string, message: string, type: string, shape: string, color: string }) {
  //   try {
  //     await firestore.collection('whiteboard').doc(room).collection('postit').doc(data.postitid).update({
  //       'message': data?.message,
  //       'type': data?.type,
  //       'shape': data?.shape,
  //       'color': data?.color,
  //     })
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  //   async deletePostit(room: string, data: { postitid: string }) {
  //   await firestore.collection('whiteboard').doc(room).collection('postit').doc(data.postitid).get()
  //     .then(async docs => {
  //       if (docs.exists) {
  //         try {
  //           await firestore.collection('whiteboard').doc(room).collection('postit').doc(data.postitid).delete()
  //         } catch (err) {
  //           console.log(err);
  //         }
  //       }
  //     })
  // }

}

database.ref('userRetrospective').on('value', (snap) => {
  snap.forEach(data => {
    if (data.val().statusOnline == false) {
      try {
        database.ref(`retrospective/${data.val().room}/shape`).once('value', (snap) => {
          try {
            snap.forEach(datas => {
              //console.log(datas.key, datas.val().selectedByUserId, datas.val().selectedByUsername)
              if (datas.val().selectedByUserId == data.key) {
                try {
                  database.ref(`retrospective/${data.val().room}/shape/${datas.key}`).update({
                    'selectedByUserId': '-',
                    'selectedByUsername': '-',
                  })
                } catch (err) {
                  console.log(err);
                }
              }
            })
          } catch (err) {
            console.log(err);

          }
        })
      } catch (err) {
        console.log(err);
      }

      if ((new Date().valueOf() - data.val().lastActive) / 1000 >= 86400) {
        try {
            database.ref(`userRetrospective/${data.key}`).remove()
            database.ref(`retrospective/${data.val().room}/roomDetail/userInRoom/${data.key}`).remove()
          }
         catch (err) {
          console.log(err);
        }
        //       if (datas.key == data.key) {
        //         database.ref(`retrospective/${data.val().room}/roomDetail/userInRoom/${datas.key}`).remove()
        //       } else if (check && num_mem >= 1) {
        //         check = false
        //         console.log('yes', datas.val(), data.val().room);
        //         database.ref(`retrospective/${data.val().room}/roomDetail`).update({

        //           'createBy': datas.key
        //         })
        //       }
        //       if (!num_mem) {
        //         database.ref(`retrospective/${data.val().room}/roomDetail`).update({
        //           'createBy': '-'
        //         })
        //       }

        //     })
        //   })
      }

    }
  })
})