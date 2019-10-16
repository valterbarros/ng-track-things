import { Component, OnInit } from '@angular/core';
import { ListsService } from '../../../providers/lists/lists.service'

@Component({
  selector: 'app-index-sub-list',
  templateUrl: './index-sub-list.html',
  styleUrls: ['./index-sub-list.scss']
})
export class IndexSubListPage implements OnInit {
  isSmoothed: boolean = false;
  subLists: Array<any> = [
    { id: 1, title: 'hello', cards: [{id: 1, name: 'hello1'}] },
    { id: 2, title: 'hello2', cards: [] },
    { id: 3, title: 'hello3', cards: [{id: 2, name: 'hello'}] }
  ];
  listCount: number = 3;
  currentListNumber: number = 0;
  scrolledPageSize: string = '0px';
  factor: number = 0;
  cursorPositionX: number = 0;
  locked: boolean = false;


  constructor(
    private listsService: ListsService
  ) { }

  ngOnInit() {
  }

  handleScrollEventChange() {/*Atualmente isso é feito no vuex ai preciso olhar com calma para reoslver essa treta e é usado dentro do card hehe*/ }

  handleTouchStartList(ev: TouchEvent) {
    this.cursorPositionX = ev.targetTouches[0].clientX
    this.locked = true
  }

  handleTouchMoveList(ev: TouchEvent) {
    this.isSmoothed = !this.locked

    const diferenceBetweenScrollX = ev.changedTouches[0].clientX - this.cursorPositionX

    if (Math.abs(diferenceBetweenScrollX) > 50 && this.locked) {
      this.scrolledPageSize = `${Math.round(diferenceBetweenScrollX)}px`
    }
  }

  handleTouchEndList(ev: TouchEvent, listOffsetWidth: number) {
    console.log(listOffsetWidth);

    const diferenceBetweenScroll = ev.changedTouches[0].clientX - this.cursorPositionX
    const sign = Math.sign(diferenceBetweenScroll)
    const factor = +(sign * diferenceBetweenScroll / listOffsetWidth).toFixed(2)

    if ((this.currentListNumber > 0 || sign < 0) && (this.currentListNumber < this.listCount - 1 || sign > 0) && factor > 0.2) {
      this.currentListNumber = this.currentListNumber -= sign
    }

    this.scrolledPageSize = '0px'
    this.factor = factor

    this.locked = false
    this.isSmoothed = !this.locked
    this.cursorPositionX = null
  }

  handleTouchCancelList(_ev: TouchEvent) {
  }
}
