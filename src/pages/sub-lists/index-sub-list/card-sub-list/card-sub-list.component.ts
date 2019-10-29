import { Component, OnInit, Input } from '@angular/core';
import { ListsService } from '../../../../providers/lists/lists.service';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../app/reducers/index';
import { Observable } from 'rxjs';
import { getDistanceBetweenElements } from '../../../../utils/calculations';
import * as DraggableComponentsActions from '../../../../app/actions/draggable.actions';

interface StyleCard {
  left: string,
  top: string,
  transform: string,
  opacity: string,
  position: string,
  zIndex: string
}

@Component({
  selector: 'card-sub-list',
  templateUrl: './card-sub-list.component.html',
  styleUrls: ['./card-sub-list.component.scss']
})
export class CardSubListComponent implements OnInit {
  stylesCard: StyleCard = {
    left: '',
    top: '',
    transform: 'rotate(0)',
    opacity: '1',
    position: 'static',
    zIndex: ''
  }

  listMoved: boolean;
  touchMovedWithoutHoldCard: boolean;
  cursorPositionX: number;
  cardMovedOldIndex: number;
  holdTouchTimeId: any;
  generalTimeout: number = 300;
  touchStartTimeStamp: number;
  cardTopOffset: number = this.getTopParentSize();

  @Input()
  placeHolderCardTemplate: HTMLDivElement;
  
  @Input()
  title: string;
  
  @Input()
  listCount: number;
  
  @Input()
  originalSublistParentId: string;
  
  @Input()
  currentClickedCardId: string;

  scrollTopSizeList$: Observable<number>;
  currentListNumber$: Observable<number>;

  constructor(
    private listsService: ListsService,
    private store: Store<State>
  ) {
    this.scrollTopSizeList$ = store.pipe(select(state => state.draggable.scrollTopSizeList));
    this.currentListNumber$ = store.pipe(select(state => state.draggable.currentListNumber));
    
  }
  
  ngOnInit() {
    console.log(this.placeHolderCardTemplate);
  }

  handleTouchStartCard (ev) {
    const card = ev.currentTarget

    this.listMoved = false // Reset listMoved
    this.touchMovedWithoutHoldCard = false // Reset touchMovedWithoutHoldCard
    this.cursorPositionX = ev.targetTouches[0].clientX
    this.cardMovedOldIndex = this.getCardIndexPosition(card) // Get current card position on list

    this.holdTouchTimeId = setTimeout(() => {
      this.stylesCard.transform = 'rotate(3deg)'
      this.stylesCard.opacity = '0.9'
      navigator.vibrate(28)
    }, this.generalTimeout)

    this.store.dispatch(DraggableComponentsActions.isSmoothed({isSmoothed: true}));

    this.touchStartTimeStamp = ev.timeStamp
  }

  handleTouchMoveCard (ev) {
    const card = ev.currentTarget
    const touchEndTimeStamp = ev.timeStamp
    const touchLocation = ev.targetTouches[0]

    if (this.touchMovedWithoutHoldCard || (touchEndTimeStamp - this.touchStartTimeStamp) < this.generalTimeout) {
      this.touchMovedWithoutHoldCard = true

      clearTimeout(this.holdTouchTimeId)

      return
    }

    ev.preventDefault()
    ev.stopPropagation()

    this.centerCardWithTouchCoordinates(card, touchLocation)

    const otherCards = card.parentElement.parentElement.querySelectorAll('.card')
    const defaultPlaceHolderCards = card.parentElement.parentElement.querySelectorAll('.default-placeholder-card')
    
    for (let otherCard of [...otherCards, ...defaultPlaceHolderCards]) {
      if (otherCard === card) { continue }

      const distance = getDistanceBetweenElements(card, otherCard)

      if (card.offsetTop > otherCard.offsetTop) {
        if (distance > 0 && distance < 80) {
          otherCard.after(this.placeHolderCardTemplate)

          this.addPlaceHolderCardOnFirstWhenOtherCardIsDefaultPlaceHolder(otherCard)
        }
      }

      if (card.offsetTop < otherCard.offsetTop) {
        if (distance > 0 && distance < 80) {
          otherCard.before(this.placeHolderCardTemplate)
        }
      }
    }

    // Code to move card of list
    if (!this.listMoved) {
      const diferenceBetweenScroll = ev.targetTouches[0].clientX - this.cursorPositionX
      const sign = Math.sign(diferenceBetweenScroll)
      const parentList = card.parentElement.parentElement.parentElement

      let currentList: number;
      this.currentListNumber$.subscribe(value => {currentList = value})
      
      const newCurrentListValue = currentList += sign

      if (Math.abs(card.offsetLeft) > this.fortyPercentyOfCardSize(card)) {
        if ((newCurrentListValue >= 0) && (newCurrentListValue <= this.listCount - 1)) {
          this.store.dispatch(DraggableComponentsActions.currentListNumber({currentListNumber: newCurrentListValue}));

          this.store.dispatch(DraggableComponentsActions.factor({factor: 0.4}));

          parentList.querySelectorAll('.list')[newCurrentListValue].appendChild(card)

          this.listMoved = true
        }
      }

      this.store.dispatch(DraggableComponentsActions.scrolledPageSize({scrolledPageSize: '0px'}));
    }
  }

  centerCardWithTouchCoordinates (card, touchLocation) {
    const diferenceBetweenScroll: string = `${touchLocation.clientX - this.cursorPositionX}px`
    let scrollTopSizeList: number;
    this.scrollTopSizeList$.subscribe(value => {scrollTopSizeList = value})

    this.stylesCard.position = 'absolute'
    this.stylesCard.left = diferenceBetweenScroll
    this.stylesCard.top = touchLocation.clientY - (card.offsetHeight / 2) - this.cardTopOffset + scrollTopSizeList + 'px'
    this.stylesCard.zIndex = '2'
  }

  addPlaceHolderCardOnFirstWhenOtherCardIsDefaultPlaceHolder (otherCard) {
    if (otherCard.classList.contains('default-placeholder-card')) {
      otherCard.before(this.placeHolderCardTemplate)
    }
  }

  fortyPercentyOfCardSize (card) {
    return (card.offsetWidth / 2) * 0.4
  }

  getTopParentSize (): number {
    return document.querySelector('.list-wrapper').getBoundingClientRect().top
  }

  handleTouchEndCard (card: HTMLDivElement, ev: TouchEvent) {
    const touchEndTimeStamp = ev.timeStamp
    let currentPlaceHolder = card.parentElement.parentElement.querySelector('.placeholder-card')

    if (this.touchMovedWithoutHoldCard || (touchEndTimeStamp - this.touchStartTimeStamp) < this.generalTimeout) {
      clearTimeout(this.holdTouchTimeId)

      return
    }
    ev.stopPropagation()

    if (currentPlaceHolder) {
      currentPlaceHolder.replaceWith(card)
    }

    // Save card order
    // this.cardMovedNewIndex = this.getCardIndexPosition(card)

    // const subListParentIdAfterMoveCard = card.parentElement.parentElement.id

    // this.saveCardsOrder(
    //   {
    //     list: {
    //       from_id: this.originalSublistParentId,
    //       to_id: subListParentIdAfterMoveCard
    //     },
    //     oldIndex: this.cardMovedOldIndex,
    //     newIndex: this.cardMovedNewIndex
    //   }
    // )

    this.stylesCard.position = 'static'
    this.stylesCard.transform = 'rotate(0)'
    this.stylesCard.opacity = '1'

    this.store.dispatch(DraggableComponentsActions.isSmoothed({isSmoothed: false}));
  }

  getCardIndexPosition (card) {
    return [...card.parentElement.querySelectorAll('.card')].indexOf(card)
  }

  handleTouchCancelCard () {
    this.stylesCard.transform = 'rotate(0)'
    this.stylesCard.opacity = '1'
  }
}
