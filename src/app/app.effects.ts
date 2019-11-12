import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import * as DraggableComponentsActions from '../app/actions/draggable.actions';
import { Observable } from 'rxjs';
import { ListsService } from '../../src/providers/lists/lists.service'

@Injectable()
export class AppEffects {
  loadSublists$ = createEffect(() => this.actions$.pipe(
      ofType(DraggableComponentsActions.requestSublist),
      mergeMap((action) => this.listService.getSublists(action.listId).pipe(
          map(v => { console.log(v); return DraggableComponentsActions.subList({subLists: v}) } ),
          catchError(() => EMPTY)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private listService: ListsService
  ) {
    console.log(actions$);
  }

  retornandaOCara(e) : Observable<number> {
    console.log(e);
    
    return of(1,2,3)
  }
}
