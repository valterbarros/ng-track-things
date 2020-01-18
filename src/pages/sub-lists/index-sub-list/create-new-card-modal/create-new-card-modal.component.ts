import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../app/reducers/index';

@Component({
  selector: 'create-new-card-modal',
  templateUrl: './create-new-card-modal.component.html',
  styleUrls: ['./create-new-card-modal.component.sass']
})
export class CreateNewCardModalComponent implements OnInit {
  @Output() closeModal: EventEmitter<any> = new EventEmitter();

  constructor(private store: Store<State>) { }

  ngOnInit() {
  }

  closeModalHandler() {
    this.closeModal.emit();
  }
}
