import { Component, OnInit } from '@angular/core';
import { ListsService } from '../../../providers/lists/lists.service'

@Component({
  selector: 'app-index-list',
  templateUrl: './index-list.html',
  styleUrls: ['./index-list.sass']
})
export class IndexListPage implements OnInit {
  lists:Array<any> = [];
  subListsCount: number;

  constructor (
    private listsService: ListsService
  ) {}

  ngOnInit () {
    this.lists = this.listsService.getLists();
    setTimeout(() => {console.log(this.lists);}, 1000)
    
    
    // this.subListsCount = this.listsService.getSubListsCount()
  }
}
