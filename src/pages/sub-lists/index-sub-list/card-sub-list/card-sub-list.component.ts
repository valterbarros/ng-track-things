import { Component, OnInit, Input, ElementRef, Renderer2, Host, HostListener } from '@angular/core';
import { ListsService } from '../../../../providers/lists/lists.service';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../app/reducers/index';
import { Observable } from 'rxjs';
import { getDistanceBetweenElements } from '../../../../utils/calculations';
import * as DraggableComponentsActions from '../../../../app/actions/draggable.actions';
import { Card } from 'src/app/models/sub-lists-model';

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
  originalSublistParentId: string;
  
  @Input()
  currentClickedCardId: string;

  @Input()
  lastCard: Card;

  scrollTopSizeList$: Observable<number>;
  currentListNumber$: Observable<number>;
  listCount$: Observable<number>;

  constructor(
    private listsService: ListsService,
    private store: Store<State>,
    private cardElement: ElementRef,
    private renderer2: Renderer2,
  ) {
    this.scrollTopSizeList$ = store.pipe(select(state => state.draggable.scrollTopSizeList));
    this.currentListNumber$ = store.pipe(select(state => state.draggable.currentListNumber));
    this.listCount$ = store.pipe(select(state => state.draggable.listCount));
  }
  
  ngOnInit() {
  }

  handleTouchStartCard (ev) {
    const card = ev.currentTarget

    this.listMoved = false // Reset listMoved
    this.touchMovedWithoutHoldCard = false // Reset touchMovedWithoutHoldCard
    this.cursorPositionX = ev.targetTouches[0].clientX
    this.cardMovedOldIndex = this.getCardIndexPosition(this.cardElement.nativeElement) // Get current card position on list

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

    const otherCards = this.cardElement.nativeElement.parentElement.querySelectorAll('.card')
    const defaultPlaceHolderCards = this.cardElement.nativeElement.parentElement.querySelectorAll('.default-placeholder-card')
    
    for (let otherCard of [...otherCards, ...defaultPlaceHolderCards]) {
      if (otherCard === card) { continue }

      const distance = getDistanceBetweenElements(card, otherCard)

      let cardToChange = otherCard.classList.contains('card') ? otherCard.parentElement : otherCard

      if (card.offsetTop > otherCard.offsetTop) {
        if (distance > 0 && distance < 80) {
          cardToChange.after(this.placeHolderCardTemplate)

          this.addPlaceHolderCardOnFirstWhenOtherCardIsDefaultPlaceHolder(otherCard)
        }
      }

      if (card.offsetTop < otherCard.offsetTop) {
        if (distance > 0 && distance < 80) {
          cardToChange.before(this.placeHolderCardTemplate)
        }
      }
    }

    // Code to move card of list
    if (!this.listMoved) {
      const diferenceBetweenScroll = ev.targetTouches[0].clientX - this.cursorPositionX
      const sign = Math.sign(diferenceBetweenScroll)
      const parentList = document.querySelector('.list-container')

      let currentList: number;
      this.currentListNumber$.subscribe(value => {currentList = value})

      let listCount: number;
      this.listCount$.subscribe(value => {listCount = value})
      
      const newCurrentListValue = currentList += sign

      if (Math.abs(card.offsetLeft) > this.fortyPercentyOfCardSize(card)) {
        if ((newCurrentListValue >= 0) && (newCurrentListValue <= listCount - 1)) {
          this.store.dispatch(DraggableComponentsActions.currentListNumber({currentListNumber: newCurrentListValue}));

          this.store.dispatch(DraggableComponentsActions.factor({factor: 0.4}));

          const currentList = parentList.querySelectorAll('.list')[newCurrentListValue]
          this.renderer2.appendChild(currentList, this.cardElement.nativeElement)

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
    let currentPlaceHolder: HTMLDivElement = this.cardElement.nativeElement.parentElement.querySelector('.placeholder-card')

    if (this.touchMovedWithoutHoldCard || (touchEndTimeStamp - this.touchStartTimeStamp) < this.generalTimeout) {
      clearTimeout(this.holdTouchTimeId)

      return
    }

    ev.stopPropagation()

    if (currentPlaceHolder) {
      currentPlaceHolder.replaceWith(this.cardElement.nativeElement)
    }

    // Save card order
    const cardMovedNewIndex = this.getCardIndexPosition(this.cardElement.nativeElement)

    const subListParentIdAfterMoveCard = this.cardElement.nativeElement.parentElement.id

    this.store.dispatch(DraggableComponentsActions.reorderCards(
      {
        list: {
          fromId: this.originalSublistParentId,
          toId: subListParentIdAfterMoveCard
        },
        oldIndex: this.cardMovedOldIndex,
        newIndex: cardMovedNewIndex
      }
    ));

    this.stylesCard.position = 'static'
    this.stylesCard.transform = 'rotate(0)'
    this.stylesCard.opacity = '1'

    this.store.dispatch(DraggableComponentsActions.isSmoothed({isSmoothed: false}));
  }

  getCardIndexPosition (card) {
    return [...card.parentElement.querySelectorAll('card-sub-list')].indexOf(card)
  }

  handleTouchCancelCard () {
    this.stylesCard.transform = 'rotate(0)'
    this.stylesCard.opacity = '1'
  }
}
