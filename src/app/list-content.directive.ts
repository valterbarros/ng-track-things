import { Directive, HostBinding, ElementRef, ContentChild, HostListener } from '@angular/core';
import { CreateNewCardComponent } from '../pages/sub-lists/index-sub-list/create-new-card/create-new-card.component' ;

@Directive({
  selector: '.list'
})
export class ListContentDirective {
  constructor(private _elemRef: ElementRef) {}
  @ContentChild(CreateNewCardComponent, {static: false})
  createNewCardComponent: CreateNewCardComponent;

  @HostBinding('class.show-create-card') private _addShowCreateCardClass = false;
  @HostBinding('class.has-scroll') private _addHasScrollClass = false;

  @HostListener('scroll', ['$event'])
  handleScrollEventChange() {
    this._addHasScrollClass = true;
  }

  toggleShowCreateCardClass() {
    this._addShowCreateCardClass = !this._addShowCreateCardClass;
  }

  focusCardTitleTextarea() {
    this.createNewCardComponent.focusTextArea();
  }
}
