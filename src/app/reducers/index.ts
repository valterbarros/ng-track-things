import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import { environment } from '../../environments/environment';
import * as draggableReducer from './draggable.reducer';

export interface State {
  draggable: draggableReducer.State
}

export const reducers: ActionReducerMap<State> = {
  draggable: draggableReducer.reducer
};


// As a middleware
export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
