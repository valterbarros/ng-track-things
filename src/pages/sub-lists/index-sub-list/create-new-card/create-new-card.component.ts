import { Component, OnInit, ViewChild, Host } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../app/reducers/index';
import { ListContentDirective } from '../../../../app/list-content.directive';
import { ListsService } from '../../../../providers/lists/lists.service';
import { Observable } from 'rxjs';
import { Card } from 'src/app/models/sub-lists-model';

@Component({
  selector: 'create-new-card',
  templateUrl: './create-new-card.component.html',
  styleUrls: ['./create-new-card.component.scss']
})
export class CreateNewCardComponent implements OnInit {
  @ViewChild('cardTitle', {static: false})
  textareaElement;

  clickedSublist$: Observable<string>;

  cardNameText: string;

  constructor(
    @Host() private listContentDirective: ListContentDirective,
    private store: Store<State>,
    private listsService: ListsService
  ) {
    this.clickedSublist$ = this.store.pipe(select(state => state.draggable.clickedSubList));
  }

  ngOnInit() {}

  blurHandler() {
    this.listContentDirective.toggleShowCreateCardClass();
  }

  saveCard() {
    this.listContentDirective.toggleShowCreateCardClass();
    let clickedSublist: string;

    this.clickedSublist$.subscribe((value) => clickedSublist = value).unsubscribe();

    const newCard: Card = {
      description: '',
      name: this.cardNameText,
      order: -1,
      sub_list_id: clickedSublist
    };

    this.listsService.addNewCardToList(newCard);
    this.cardNameText = '';
  }

  focusTextArea() {
    setTimeout(() => {
      this.textareaElement.nativeElement.focus();
    }, 0);
  }
}
