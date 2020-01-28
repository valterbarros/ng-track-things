import { Component, OnInit, Input, Host } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../app/reducers/index';
import * as DraggableComponentsActions from '../../../../app/actions/draggable.actions';
import { ListContentDirective } from '../../../../app/list-content.directive';

@Component({
  selector: 'create-new-card-button',
  templateUrl: './create-new-card-button.component.html',
  styleUrls: ['./create-new-card-button.component.scss']
})
export class CreateNewCardButtonComponent implements OnInit {
  @Input() subListId: string;

  constructor(
    private store: Store<State>,
    @Host() private listContentDirective: ListContentDirective
  ) { }

  ngOnInit() {
    console.log(this.subListId);
  }

  handleNewButtonClick() {
    this.listContentDirective.toggleShowCreateCardClass();
    this.listContentDirective.focusCardTitleTextarea();

    this.store.dispatch(DraggableComponentsActions.clickedSubList({ clickedSubList: this.subListId }));
  }
}
