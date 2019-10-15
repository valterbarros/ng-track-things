import { Component, OnInit, Input } from '@angular/core';
import { ListsService } from '../../../../providers/lists/lists.service'

@Component({
  selector: 'card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {
  lists: Array<any> = [];
  subListsCount: number;
  @Input() listId: string;
  @Input() title: string;
  count: number;

  constructor(
    private listsService: ListsService
  ) { }

  ngOnInit() {
    this.getSubListsCount(this.listId);
  }

  async getSubListsCount(id: string) {
    this.count = await this.listsService.getSubListsCount(id)
  }
}
