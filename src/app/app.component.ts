import { Component } from '@angular/core';
import { trigger, transition, style, query, group, animateChild, animate, animation, useAnimation } from '@angular/animations';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeAnimations', [
      transition('IndexSubList => *, NewList => IndexList', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ]),
        query(':enter', [
          style({ left: '-100%' })
        ]),
        query(':leave', animateChild()),
        group([
          query(':leave', [
            animate('300ms ease-out', style({ left: '100%' }))
          ]),
          query(':enter', [
            animate('300ms ease-in', style({ left: '0%' }))
          ])
        ]),
        query(':enter', animateChild()),
      ]),
      transition('IndexList => *', [
        style({ position: 'relative' }),
        query(':enter, :leave', [
          style({
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%'
          })
        ]),
        query(':enter', [
          style({ left: '100%' })
        ]),
        query(':leave', animateChild()),
        group([
          query(':leave', [
            animate('300ms ease-out', style({ left: '-100%' }))
          ]),
          query(':enter', [
            animate('300ms ease-in', style({ left: '0%' }))
          ])
        ]),
        query(':enter', animateChild()),
      ])
    ])
  ]
})
export class AppComponent {
  title = 'ng-track-things';

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
  }
}
