import { Component, Input } from '@angular/core';
import { State } from 'src/app/reducers/index';
import { Store } from '@ngrx/store';
import * as DraggableComponentsActions from 'src/app/actions/draggable.actions';

@Component({
  selector: 'card-info-button',
  templateUrl: './card-info-button.component.html',
  styleUrls: ['./card-info-button.component.scss']
})
export class CardInfoButtonComponent {
  @Input()
  currentClickedCardId: string;

  constructor(private store: Store<State[]>) {
  }

  onClick() {
    this.store.dispatch(DraggableComponentsActions.clickedCard({clickedCard: this.currentClickedCardId}));
    this.store.dispatch(DraggableComponentsActions.cardInfoModalVisible({cardInfoModalVisible: true}));
  }
}
