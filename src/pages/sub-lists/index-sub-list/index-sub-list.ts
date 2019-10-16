import { Component, OnInit } from '@angular/core';
import { ListsService } from '../../../providers/lists/lists.service'

@Component({
  selector: 'app-index-sub-list',
  templateUrl: './index-sub-list.html',
  styleUrls: ['./index-sub-list.scss']
})
export class IndexSubListPage implements OnInit {
  isSmoothed: boolean = false;
  subLists: Array<any> = [{title: 'hello'}];
  listCount: number = 1;
  currentListNumber: number = 0;
  scrolledPageSize: number = 0;
  factor: number = 0;


  constructor (
    private listsService: ListsService
  ) {}

  ngOnInit () {
  }
}
