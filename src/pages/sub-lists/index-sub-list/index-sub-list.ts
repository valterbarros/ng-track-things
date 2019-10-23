import { Component, OnInit } from '@angular/core';
import { ListsService } from '../../../providers/lists/lists.service'
import { Store, select } from '@ngrx/store';
import { State } from '../../../app/reducers/index';
import { Observable } from 'rxjs';
import * as DraggableComponentsActions from '../../../app/actions/draggable.actions';

@Component({
  selector: 'app-index-sub-list',
  templateUrl: './index-sub-list.html',
  styleUrls: ['./index-sub-list.scss']
})
export class IndexSubListPage implements OnInit {
  //Mover para store de NGRX pois é necessário na reordenação de cards
  subLists: Array<any> = [
    { id: 1, title: 'hello', cards: [{id: 1, name: 'hello1'}] },
    { id: 2, title: 'hello2', cards: [] },
    { id: 3, title: 'hello3', cards: [{id: 2, name: 'hello'}] }
  ];
  listCount: number = 3;
  cursorPositionX: number = 0;
  locked: boolean = false;
  
  //NGRX
  isSmoothed$: Observable<boolean>;
  currentListNumber$: Observable<number>;

  scrolledPageSize: string = '0px';
  factor: number = 0;

  constructor(
    private listsService: ListsService,
    private store: Store<State>
  ) {
    this.isSmoothed$ = store.pipe(select(state => state.draggable.isSmoothed));
    this.currentListNumber$ = store.pipe(select(state => state.draggable.currentListNumber));
  }

  ngOnInit() {
  }

  handleScrollEventChange() {/*Atualmente isso é feito no vuex ai preciso olhar com calma para reoslver essa treta e é usado dentro do card hehe*/ }

  handleTouchStartList(ev: TouchEvent) {
    this.cursorPositionX = ev.targetTouches[0].clientX
    this.locked = true
  }

  handleTouchMoveList(ev: TouchEvent) {
    this.store.dispatch(DraggableComponentsActions.isSmoothed({isSmoothed: !this.locked}))

    const diferenceBetweenScrollX = ev.changedTouches[0].clientX - this.cursorPositionX

    if (Math.abs(diferenceBetweenScrollX) > 50 && this.locked) {
      this.scrolledPageSize = `${Math.round(diferenceBetweenScrollX)}px`
    }
  }

  async handleTouchEndList(ev: TouchEvent, listOffsetWidth: number) {
    const diferenceBetweenScroll = ev.changedTouches[0].clientX - this.cursorPositionX
    const sign = Math.sign(diferenceBetweenScroll)
    const factor = +(sign * diferenceBetweenScroll / listOffsetWidth).toFixed(2)

    let currentListNumber: number;
    this.currentListNumber$.subscribe(value => { currentListNumber = value })

    if ((currentListNumber > 0 || sign < 0) && (currentListNumber < this.listCount - 1 || sign > 0) && factor > 0.2) {
      this.store.dispatch(DraggableComponentsActions.currentListNumber({currentListNumber: (currentListNumber -= sign)}))
    }

    this.scrolledPageSize = '0px'
    this.factor = factor

    this.locked = false

    this.store.dispatch(DraggableComponentsActions.isSmoothed({isSmoothed: !this.locked}))

    this.cursorPositionX = null
  }

  handleTouchCancelList(_ev: TouchEvent) {
  }
}
