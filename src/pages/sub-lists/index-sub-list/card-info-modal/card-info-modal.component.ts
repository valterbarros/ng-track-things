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
  styleImageObject: { transform: string, zIndex: number, transformOrigin: string } = {
    transform: '',
    zIndex: 8,
    transformOrigin: ''
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

    this.imageClickedIndex = index;

    //-- y position
    const viewportHeight = window.innerHeight;

    const imageSizeHeightScaled = e.currentTarget.getBoundingClientRect().height * 2.5;

    const imageBottom = e.currentTarget.getBoundingClientRect().bottom;
    const subtractScreenByImageBottomPosition = viewportHeight - imageBottom;

    const middleRestOfScreenAndImage = (imageSizeHeightScaled - viewportHeight) / 2;
    
    const finalPositionY = subtractScreenByImageBottomPosition + middleRestOfScreenAndImage;

    //--- x position
    const viewportWidth = window.innerWidth;
    const imageSizeWidthScaled = e.currentTarget.getBoundingClientRect().width * 2.5;
    const xCoordinator = (viewportWidth - imageSizeWidthScaled) / 2;

    const leftBeforeTransformation = e.currentTarget.getBoundingClientRect().left;

    const finalPositionX = xCoordinator - leftBeforeTransformation

    this.styleImageObject = {
      transform: `translate(${finalPositionX}px,${finalPositionY}px) scale(2.5)`,
      zIndex: 15,
      transformOrigin: 'bottom left'
    }

    this.imageIsTransformed = true;
  }

  closeFullBackgroundShadow () {
    this.imageIsTransformed = false;

    this.styleImageObject = {
      transform: 'translate(0, 0) scale(1)',
      zIndex: 8,
      transformOrigin: 'bottom left'
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
