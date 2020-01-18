import { Component, OnInit, Input } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../app/reducers/index';
import * as DraggableComponentsActions from '../../../../app/actions/draggable.actions';

@Component({
  selector: 'create-new-card-button',
  templateUrl: './create-new-card-button.component.html',
  styleUrls: ['./create-new-card-button.component.sass']
})
export class CreateNewCardButtonComponent implements OnInit {
  @Input() subListId: string;

  constructor(private store: Store<State>) { }

  ngOnInit() {
    console.log(this.subListId);
  }

  handleNewButtonClick() {
    this.store.dispatch(DraggableComponentsActions.clickedSubList({clickedSubList: this.subListId}));
  }
}
