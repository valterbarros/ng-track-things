import { Component, OnInit, HostListener } from '@angular/core';
import { ListsService } from '../../../providers/lists/lists.service'
import { Store, select } from '@ngrx/store';
import { State } from '../../../app/reducers/index';
import { SubList } from '../../../app/models/sub-lists-model';
import { Observable } from 'rxjs';
import * as DraggableComponentsActions from '../../../app/actions/draggable.actions';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-index-sub-list',
  templateUrl: './index-sub-list.html',
  styleUrls: ['./index-sub-list.scss']
})
export class IndexSubListPage implements OnInit {
  cursorPositionX: number = 0;
  locked: boolean = false;
  placeHolderCardTemplate: HTMLDivElement = this.generatePlaceHolderCard();
  showNewCardModal = false;
  
  // NGRX
  listCount$: Observable<number>;
  isSmoothed$: Observable<boolean>;
  currentListNumber$: Observable<number>;
  factor$: Observable<number>;
  scrolledPageSize$: Observable<string>;
  subLists$: Observable<SubList[]>;

  constructor(
    private listsService: ListsService,
    private store: Store<State>,
    private route: ActivatedRoute
  ) {
    this.isSmoothed$ = store.pipe(select(state => state.draggable.isSmoothed));
    this.currentListNumber$ = store.pipe(select(state => state.draggable.currentListNumber));
    this.factor$ = store.pipe(select(state => state.draggable.factor));
    this.scrolledPageSize$ = store.pipe(select(state => state.draggable.scrolledPageSize));
    this.subLists$ = store.pipe(select(state => state.draggable.subLists));
    this.listCount$ = store.pipe(select(state => state.draggable.listCount));
    const listId = this.route.snapshot.paramMap.get('listId');
    store.dispatch(DraggableComponentsActions.requestSublist({ listId }));
  }

  ngOnInit() {}

  handleTouchStartList(ev: TouchEvent) {
    this.cursorPositionX = ev.targetTouches[0].clientX
    this.locked = true
  }

  handleTouchMoveList(ev: TouchEvent) {
    this.store.dispatch(DraggableComponentsActions.isSmoothed({isSmoothed: !this.locked}))

    const diferenceBetweenScrollX = ev.changedTouches[0].clientX - this.cursorPositionX

    if (Math.abs(diferenceBetweenScrollX) > 50 && this.locked) {
      this.store.dispatch(DraggableComponentsActions.scrolledPageSize({scrolledPageSize: `${Math.round(diferenceBetweenScrollX)}px`}));
    }
  }

  async handleTouchEndList(ev: TouchEvent, listOffsetWidth: number) {
    const diferenceBetweenScroll = ev.changedTouches[0].clientX - this.cursorPositionX
    const sign = Math.sign(diferenceBetweenScroll)
    const factor = +(sign * diferenceBetweenScroll / listOffsetWidth).toFixed(2)

    let currentListNumber: number;
    this.currentListNumber$.subscribe(value => { currentListNumber = value })
    
    let listCount: number;
    this.listCount$.subscribe(value => { listCount = value })
    
    if ((currentListNumber > 0 || sign < 0) && (currentListNumber < listCount - 1 || sign > 0) && factor > 0.2) {
      this.store.dispatch(DraggableComponentsActions.currentListNumber({currentListNumber: (currentListNumber -= sign)}))
    }

    this.store.dispatch(DraggableComponentsActions.factor({factor: factor}));
    this.store.dispatch(DraggableComponentsActions.scrolledPageSize({scrolledPageSize: '0px'}));

    this.locked = false

    this.store.dispatch(DraggableComponentsActions.isSmoothed({isSmoothed: !this.locked}))

    this.cursorPositionX = null
  }

  handleTouchCancelList(_ev: TouchEvent) {
  }
  
  @HostListener('scroll', ['$event']) 
  handleScrollEventChange (scrollTop: number) {
    this.store.dispatch(DraggableComponentsActions.scrollTopSizeList({scrollTopSizeList: scrollTop}))
  }

  generatePlaceHolderCard () : HTMLDivElement {
    const placeHolderCard = document.createElement('div')

    placeHolderCard.classList.add('placeholder-card')

    return placeHolderCard
  }
}
