import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../app/reducers/index';
import * as DraggableComponentsActions from 'src/app/actions/draggable.actions';
import { Observable } from 'rxjs';
import { state, style, trigger, transition, animate } from '@angular/animations';

@Component({
  selector: 'card-info-modal',
  templateUrl: './card-info-modal.component.html',
  styleUrls: ['./card-info-modal.component.scss'],
  animations: [
    trigger('showHide', [
        state('show', style({
          transform: 'translateX(0)'
        })),
        state('void', style({
          transform: 'translateX(-100%)'
        })),
        transition('show => void', [
          animate('300ms ease-out')
        ]),
        transition('void => show', [
          animate('300ms ease-in')
        ]),
      ]
    )
  ]
})
export class CardInfoModalComponent implements OnInit {
  currentLocalImage: string;
  uploadDone: boolean;
  isToShowModal$: Observable<boolean>;
  testando = false;

  constructor(private store: Store<State>) {
    this.isToShowModal$ = this.store.pipe(select((state) => state.draggable.cardInfoModalVisible));
  }

  ngOnInit() {
  }

  closeModalHandler() {
    this.store.dispatch(DraggableComponentsActions.cardInfoModalVisible({cardInfoModalVisible: false}));
    this.testando = true;
  }

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
}
