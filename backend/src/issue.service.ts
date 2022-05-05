import { Injectable } from '@nestjs/common';
import firestore from './utils/firebase';
import 'firebase/compat/firestore';

@Injectable()
export class IssueService {
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
}