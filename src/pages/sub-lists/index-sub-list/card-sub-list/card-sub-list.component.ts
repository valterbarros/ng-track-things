import { Component, OnInit } from '@angular/core';
import { ListsService } from '../../../../providers/lists/lists.service'

@Component({
  selector: 'card-sub-list',
  templateUrl: './card-sub-list.component.html',
  styleUrls: ['./card-sub-list.component.scss']
})
export class CardSubListComponent implements OnInit {
  stylesCard = {
    left: 0,
    top: 0,
    transform: 'rotate(0)',
    opacity: 1,
    position: 'static',
    zIndex: 0
  }

  listMoved: boolean;
  touchMovedWithoutHoldCard: boolean;
  cursorPositionX: number;

  originalSublistParentId: string;
  listCount: number;
  title: string;
  currentList: number;
  placeHolderCardTemplate: HTMLDivElement;
  currentClickedCardId: string;

  constructor(
    private listsService: ListsService,
  ) { }

  ngOnInit() {
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

    this.changeValueFromIsSmoothedOnParent(true)

    this.touchStartTimeStamp = ev.timeStamp
  }

}
