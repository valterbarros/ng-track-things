import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../app/reducers/index';

@Component({
  selector: 'card-info-modal',
  templateUrl: './card-info-modal.component.html',
  styleUrls: ['./card-info-modal.component.sass']
})
export class CardInfoModalComponent implements OnInit {
  @Output() closeModal: EventEmitter<any> = new EventEmitter();

  constructor(private store: Store<State>) { }

  ngOnInit() {
  }

  closeModalHandler() {
    this.closeModal.emit();
  }
}
