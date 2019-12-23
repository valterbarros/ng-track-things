import { Directive, HostBinding, ElementRef } from '@angular/core';

@Directive({
  selector: '.list'
})
export class ListContentDirective {
  @HostBinding('class.overflow') private _addOverflow = false;
  constructor(private _elemRef: ElementRef) {}

  addOverflow() {
    this._addOverflow = true;
  }
}
