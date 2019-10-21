import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createSelector,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../environments/environment';

export interface State {
  name: ''
}

export const reducers: ActionReducerMap<State> = {
  name
};


export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
