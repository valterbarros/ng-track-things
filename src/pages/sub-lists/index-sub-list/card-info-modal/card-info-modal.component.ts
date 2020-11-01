import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { State } from '../../../../app/reducers/index';
import * as DraggableComponentsActions from 'src/app/actions/draggable.actions';
import { Observable } from 'rxjs';
import { state, style, trigger, transition, animate } from '@angular/animations';
import { ListsService } from 'src/providers/lists/lists.service';
import { mergeMap } from 'rxjs/operators';
import { Card } from 'src/app/models/sub-lists-model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'card-info-modal',
  templateUrl: './card-info-modal.component.html',
  styleUrls: ['./card-info-modal.component.scss'],
  animations: [
    trigger('showHide', [
      state('show', style({
        transform: 'translateY(0)'
      })),
      state('void', style({
        transform: 'translateY(100%)'
      })),
      transition('show => void', [
        animate('300ms ease-out')
      ]),
      transition('void => show', [
        animate('300ms ease-in')
      ]),
    ]),
    trigger('showHideShadow', [
      state('show', style({
        opacity: 1
      })),
      state('void', style({
        opacity: 0
      })),
      transition('show => void', [
        animate('300ms ease-out')
      ]),
      transition('void => show', [
        animate('300ms ease-in')
      ]),
    ])
  ]
})
export class CardInfoModalComponent implements OnInit {
  currentLocalImage: SafeUrl;
  uploadDone = true;
  isToShowModal$: Observable<boolean>;
  card: Card = {
    description: '',
    name: '',
    order: -1,
    sub_list_id: ''
  };
  cardId: string;
  editingTitle = false;
  editingDescription = false;
  uploadStart = false;
  imageIsTransformed = false;
  imageClickedIndex: number;
  imageCoordinator = {
    x: '0px',
    y: '0px'
  }
  styleImageObject: { transform: string, zIndex: number } = {
    transform: '',
    zIndex: 8
  }

  constructor(
    private store: Store<State>,
    private listService: ListsService,
    private sanitizer: DomSanitizer
  ) {
    this.isToShowModal$ = this.store.pipe(select((storeState) => storeState.draggable.cardInfoModalVisible));
    this.updateCardData();
  }

  ngOnInit() {
  }

  closeModalHandler() {
    this.store.dispatch(DraggableComponentsActions.cardInfoModalVisible({ cardInfoModalVisible: false }));
  }

  handleAttachmentClick(inputImageUpload) {
    inputImageUpload.click();
  }

  handleSelectNewImage(e) {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    const buildUrlImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(file));

    this.currentLocalImage = buildUrlImage;
    this.uploadDone = false;

    // Save image on firebase and update the card registry on firebase
    this.store.pipe(select((storeState) => storeState.draggable.clickedCard)).subscribe((cardId: string) => {
      this.uploadStart = true;

      this.listService.saveImageOnFileStorageAndUpdateUrlImagesOnCards(file, cardId).subscribe(() => {
        this.uploadDone = true;
        this.uploadStart = false;
        this.updateCardData();
      })
    });
  }

  updateCardData() {
    this.store.pipe(
      select((storeState) => storeState.draggable.clickedCard),
      mergeMap((cardId) => this.listService.getCard(cardId))
    ).subscribe((card) => this.card = card);
  }

  closeEdit() {
    this.editingDescription = this.editingTitle = false;
  }

  handleRemoveImage(e, imageUrl) {
    this.store.pipe(select((storeState) => storeState.draggable.clickedCard)).subscribe((cardId: string) => {
      this.listService.removeImageFromFileStorageAndRemoveUrlImageFromCards(cardId, imageUrl).subscribe(() => {
        this.updateCardData();
      });
    });

    e.stopPropagation();
  }

  handleExpandImage(index: number, e) {
    if (this.imageIsTransformed) {
      return;
    }

    const viewportHeight = window.innerHeight;
    const imageSizeHeightScaled = e.currentTarget.getBoundingClientRect().height * 2.5;

    // Calculate top discount
    const topBeforeImageTransform = e.currentTarget.getBoundingClientRect().top;
    const topDiscount = imageSizeHeightScaled - e.currentTarget.getBoundingClientRect().height;
    const futureTopImageSize = topBeforeImageTransform - (topDiscount / 2);

    // now has 248 of viewport top      
    // e quanto eu quero que ele tenha?
    console.log(futureTopImageSize);

    const subtract = viewportHeight - imageSizeHeightScaled;
    const dividSubtract = subtract / 2;
    const topfinalValue = futureTopImageSize - dividSubtract;

    console.log(futureTopImageSize);
    console.log(dividSubtract);

    this.imageClickedIndex = index;

    this.imageCoordinator.x = '103%';
    this.imageCoordinator.y = `${-topfinalValue}px`;

    this.styleImageObject = {
      transform: `translate(${this.imageCoordinator.x}, ${this.imageCoordinator.y}) scale(2.5)`,
      zIndex: 15
    }

    this.imageIsTransformed = true;
  }

  closeFullBackgroundShadow () {
    this.imageIsTransformed = false;

    this.styleImageObject = {
      transform: 'translate(0, 0) scale(1)',
      zIndex: 8
    }
  }

  saveChange() {
    const cardCopy = JSON.parse(JSON.stringify(this.card));

    this.store.pipe(select((storeState) => storeState.draggable.clickedCard)).subscribe((cardId: string) => {
      this.listService.editNameOrDescriptionFromCard(cardId, cardCopy).then(() => {
        this.editingDescription = this.editingTitle = false;
      }).catch((err) => {
        console.log('edit name or description', err);
      })
    })
  }
}
