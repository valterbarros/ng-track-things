import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../app/reducers/index';
import * as DraggableComponentsActions from 'src/app/actions/draggable.actions';
import { Observable } from 'rxjs';
import { state, style, trigger, transition, animate } from '@angular/animations';
import { ListsService } from 'src/providers/lists/lists.service';
import { mergeMap } from 'rxjs/operators';
import { Card } from 'src/app/models/sub-lists-model';

@Component({
  selector: 'card-info-modal',
  templateUrl: './card-info-modal.component.html',
  styleUrls: ['./card-info-modal.component.scss'],
  animations: [
    trigger('showHide', [
      state('show', style({
        transform: 'translateY(0)'
      })),
      state('void', style({
        transform: 'translateY(100%)'
      })),
      transition('show => void', [
        animate('300ms ease-out')
      ]),
      transition('void => show', [
        animate('300ms ease-in')
      ]),
    ])
  ]
})
export class CardInfoModalComponent implements OnInit {
  currentLocalImage: string;
  uploadDone: boolean;
  isToShowModal$: Observable<boolean>;
  card: Card = {
    description: '',
    name: '',
    order: -1,
    sub_list_id: ''
  };
  editingTitle = false;
  editingDescription = false;

  constructor(
    private store: Store<State>,
    private listService: ListsService
  ) {
    this.isToShowModal$ = this.store.pipe(select((storeState) => storeState.draggable.cardInfoModalVisible));
    this.store.pipe(
      select((storeState) => storeState.draggable.clickedCard),
      mergeMap((cardId) => this.listService.getCard(cardId))
    )
    .subscribe((card) => this.card = card);
  }

  ngOnInit() {
  }

  closeModalHandler() {
    this.store.dispatch(DraggableComponentsActions.cardInfoModalVisible({cardInfoModalVisible: false}));  }

  handleAttachmentClick(inputImageUpload) {
    inputImageUpload.click();
  }

  handleSelectNewImage(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const buildUrlImage = URL.createObjectURL(file);

    this.currentLocalImage = buildUrlImage;
    this.uploadDone = false;

    // Save image on firebase and update the card registry on firebase
  }

  closeEdit() {
    this.editingDescription = this.editingTitle = false;
  }

  saveChange() {

  }
}
