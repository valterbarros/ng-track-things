import {Directive, ElementRef, Input} from '@angular/core';

/*
 * Workaround for setting CSS custom properties:
 * https://github.com/angular/angular/issues/9343
 *
 * Can work for any style properties.
 */
@Directive({
    selector: '[cssProps]',
})
export class FixForCssVarsDirective {

    @Input() cssProps: any;

    constructor(private element: ElementRef) {}

    ngOnChanges({cssProps}) {
        if (cssProps && cssProps.currentValue) {
            const {style} = this.element.nativeElement;
            for (const [k, v] of Object.entries(cssProps.currentValue)) {
                style.setProperty(k, v);
            }
        }
    }
}
