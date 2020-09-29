import { Injectable } from '@angular/core';
import { firebaseDb, firebaseStorage, firebase } from '../firebase';
import { Observable, EMPTY } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { State } from '../../app/reducers/index';
import * as DraggableComponentsActions from '../../app/actions/draggable.actions';
import { Card } from 'src/app/models/sub-lists-model';

// Move tha to utils maybe or another file
function getSublistByIdFunction(subLists, id) {
  return subLists.find((subList) => {
    return subList.id === id;
  });
}

// Move tha to utils maybe or another file
function updateCardsPositionAndParentListId(cardsCollection, listId) {
  let order = 0;

  cardsCollection.forEach((card) => {
    const cardId = card.id;
    card.order = order;
    order += 1;

    firebaseDb.collection('cards').doc(cardId).update({
      order,
      sub_list_id: listId
    });
  });
}

@Injectable({
  providedIn: 'root'
})
export class ListsService {

  constructor(private store: Store<State>) { }

  getLists() {
    const lists = [];

    firebaseDb.collection('lists').get().then((querySnapshot) => {
      querySnapshot.forEach(doc => {
        lists.push({ ...doc.data(), docId: doc.id });
      });
    }).catch((e) => {
      console.log(e);
    });

    return lists;
  }

  getSubListsCount(listId: string): Promise<number> {
    let subListsCount = 0;

    return new Promise(async function(resolve, reject) {
      await firebaseDb.collection('sub_lists').where('list_id', '==', listId).get().then((querySnapshot) => {
        querySnapshot.forEach(doc => {
          subListsCount += 1;
        });
      }).catch((e) => {
        console.log(e);
        reject(e);
      });

      resolve(subListsCount);
    });
  }

  createListAndSublist() { }

  getSublists(docId: string): Observable<any> {
    return new Observable(observer => {
      firebaseDb.collection('sub_lists').where('list_id', '==', docId).get().then((querySnapshot) => {
        querySnapshot.forEach(async doc => {
          const subListDocId = doc.id;
          let cards: Array<any> = [];

          const querySnapshot = await firebaseDb.collection('cards').where('sub_list_id', '==', subListDocId).orderBy('order').get();

          querySnapshot.forEach(doc => {
            const cardId: string = doc.id;

            cards = [...cards, { ...doc.data(), id: cardId }];
          });

          observer.next({ ...doc.data(), cards, id: subListDocId });
        });
      });
    });
  }

  reorderCards(list, oldIndex, newIndex) {
    const subLists$ = this.store.pipe(select(state => state.draggable.subLists));

    let subLists;

    subLists$.subscribe((value) => subLists = JSON.parse(JSON.stringify(value))).unsubscribe();

    const fromListId = list.fromId;
    const toListId = list.toId;

    const cardsCollectionFromList = getSublistByIdFunction(subLists, fromListId).cards;

    const cardRemovedFromFromList = cardsCollectionFromList.splice(oldIndex, 1)[0];

    const cardsCollectionToList = getSublistByIdFunction(subLists, toListId).cards;
    cardsCollectionToList.splice(newIndex, 0, cardRemovedFromFromList);

    this.store.dispatch(DraggableComponentsActions.resetSubList());

    subLists.map((subList) => {
      this.store.dispatch(DraggableComponentsActions.subList({ subList }));
    });

    this.saveCardsOrder(subLists, list);
  }

  saveCardsOrder(subLists, list) {
    const fromListId = list.fromId;
    const toListId = list.toId;
    const cardsCollectionFromList = getSublistByIdFunction(subLists, fromListId).cards;
    const cardsCollectionToList = getSublistByIdFunction(subLists, toListId).cards;

    if (fromListId === toListId) {
      updateCardsPositionAndParentListId(cardsCollectionFromList, fromListId);

      return;
    }

    updateCardsPositionAndParentListId(cardsCollectionToList, toListId);
  }

  addNewCardToList(newCard) {
    const subLists$ = this.store.pipe(select(state => state.draggable.subLists));

    let subLists;

    subLists$.subscribe((value) => subLists = JSON.parse(JSON.stringify(value))).unsubscribe();

    const cardsCollectionFromList = getSublistByIdFunction(subLists, newCard.sub_list_id).cards;

    const firebaseReference = this.generateANewCardReference();
    newCard.id = firebaseReference.id;

    cardsCollectionFromList.unshift(newCard);
    this.store.dispatch(DraggableComponentsActions.resetSubList());

    subLists.map((subList) => {
      this.store.dispatch(DraggableComponentsActions.subList({ subList }));
    });

    this.saveNewCard(firebaseReference, newCard);
  }

  generateANewCardReference(): firebase.firestore.DocumentReference {
    return firebaseDb.collection('cards').doc();
  }

  saveNewCard(reference: firebase.firestore.DocumentReference, newCard: Card) {
    reference.set(newCard).catch(err => {
      console.log(err);
    });
  }

  saveImageOnFileStorageAndUpdateUrlImagesOnCards(file) {
    // commit('setImageUploadStart', true);

    const uploadTask = firebaseStorage.ref().child(file.name).put(file);

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      function handleChange(snapshot) {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

        // commit('setImageUploadProgressValue', Number(progress.toFixed(1)));

        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            break;
        }
      },
      function handleError(error) {
        console.log(error);
      },
      function handleComplete() {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadUrl) => {
          firebaseDb.collection('cards').doc('state.currentClickedCardId')
            .update({urlImages: firebase.firestore.FieldValue.arrayUnion(downloadUrl)});

          // commit('pushToUrlImagesOnCardDetails', downloadUrl);
        });
      });

    return uploadTask;
  }

  getCard(cardId: string): Observable<Card> {
    if (cardId === '-1') { return EMPTY; }

    return new Observable((obs) => {
      console.log(cardId);

      firebaseDb.collection('cards').doc(cardId).get().then((documentSnapshot) => {
        console.log(documentSnapshot);

        const { urlImages = [] } = documentSnapshot.data();

        obs.next({ ...documentSnapshot.data(), urlImages } as Card);
      }).catch((err) => {
        obs.error(err);
      });
    });
  }
}
