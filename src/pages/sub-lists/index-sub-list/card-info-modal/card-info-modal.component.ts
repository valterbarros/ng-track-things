import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';
import { State } from '../../../../app/reducers/index';

@Component({
  selector: 'card-info-modal',
  templateUrl: './card-info-modal.component.html',
  styleUrls: ['./card-info-modal.component.scss']
})
export class CardInfoModalComponent implements OnInit {
  currentLocalImage: string;
  uploadDone: boolean;
  @Output() closeModal: EventEmitter<any> = new EventEmitter();

  constructor(private store: Store<State>) { }

  ngOnInit() {
  }

  closeModalHandler() {
    this.closeModal.emit();
  }

  handleAttachmentClick(inputImageUpload) {
    inputImageUpload.click();
  }

  handleSelectNewImage(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const buildUrlImage = URL.createObjectURL(file);

    this.currentLocalImage = buildUrlImage;
    this.uploadDone = false;

    //Save image on firebase and update the card registry on firebase
  }
}
