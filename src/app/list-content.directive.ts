import { Directive, HostBinding, ElementRef, ContentChild, HostListener } from '@angular/core';
import { CreateNewCardComponent } from '../pages/sub-lists/index-sub-list/create-new-card/create-new-card.component' ;

@Directive({
  selector: '.list'
})
export class ListContentDirective {
  constructor(elemRef: ElementRef) {
    setTimeout(() => {
      this._addHasScrollClass = elemRef.nativeElement.scrollHeight > elemRef.nativeElement.clientHeight;
    });
  }
  @ContentChild(CreateNewCardComponent, {static: false})
  createNewCardComponent: CreateNewCardComponent;

  @HostBinding('class.show-create-card') private _addShowCreateCardClass = false;
  @HostBinding('class.has-scroll') private _addHasScrollClass = false;

  toggleShowCreateCardClass() {
    this._addShowCreateCardClass = !this._addShowCreateCardClass;
  }

  // Circular dependency
  focusCardTitleTextarea() {
    this.createNewCardComponent.focusTextArea();
  }
}
