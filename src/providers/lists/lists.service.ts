import { Injectable } from '@angular/core';
import { firebaseDb } from '../firebase';

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  constructor() { }

  getLists() {
    const lists = []

    firebaseDb.collection('lists').get().then((querySnapshot) => {
      querySnapshot.forEach(doc => {
        lists.push({ ...doc.data(), docId: doc.id })
      })
    }).catch((e) => {
      console.log(e)
    })

    return lists;
  }

  getSubListsCount(docId: string): Promise<number> {
    let subListsCount: number = 0;

    return new Promise(async function (resolve, reject) {
      await firebaseDb.collection('sub_lists').where('list_id', '==', docId).get().then((querySnapshot) => {
        querySnapshot.forEach(doc => {
          subListsCount += 1
        })
      }).catch((e) => {
        console.log(e)
        reject(e);
      });

      resolve(subListsCount);
    })
  }

  createListAndSublist() { }
}
