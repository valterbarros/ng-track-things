import { Injectable } from '@angular/core';
import { firebaseDb } from '../firebase';
import { Observable, from, of } from 'rxjs';
import { concatMap, mergeMap, map } from 'rxjs/operators';

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

  getSubListsCount(listId: string): Promise<number> {
    let subListsCount: number = 0;

    return new Promise(async function (resolve, reject) {
      await firebaseDb.collection('sub_lists').where('list_id', '==', listId).get().then((querySnapshot) => {
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

  getSublists (docId: string) : Observable<any> {
    const subLists: Array<any> = [];

    return new Observable(observer => {
      firebaseDb.collection('sub_lists').where('list_id', '==', docId).get().then((querySnapshot) => {
        querySnapshot.forEach(doc => {
          const subListDocId = doc.id
          let cards: Array<any> = []

          firebaseDb.collection('cards').where('sub_list_id', '==', subListDocId).orderBy('order').get().then((querySnapshot) => {
            querySnapshot.forEach(doc => {
              const cardId: string = doc.id

              cards.push({...doc.data(), id: cardId})
            } )
          })

          observer.next({...doc.data(), cards: cards, id: subListDocId })
        })
      })
    })
  }
}
