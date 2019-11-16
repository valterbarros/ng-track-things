import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, mergeMap, catchError, tap } from 'rxjs/operators';
import { EMPTY, of } from 'rxjs';
import * as DraggableComponentsActions from '../app/actions/draggable.actions';
import { Observable } from 'rxjs';
import { ListsService } from '../../src/providers/lists/lists.service'
import { Store } from '@ngrx/store';
import { State } from '../app/reducers/index';

@Injectable()
export class AppEffects {
  loadSublists$ = createEffect(() => this.actions$.pipe(
      ofType(DraggableComponentsActions.requestSublist),
      mergeMap((action) => this.listService.getSublists(action.listId).pipe(
          map(v => { return DraggableComponentsActions.subList({subList: v}) } ),
          catchError(() => EMPTY)
        )
      ),
      tap(() => this.store.dispatch(DraggableComponentsActions.listCount()))
    )
  );

  constructor(
    private actions$: Actions,
    private listService: ListsService,
    private store: Store<State>
  ) {}
}
