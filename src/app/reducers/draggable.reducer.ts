import {
  createReducer,
  Action,
  on
} from '@ngrx/store';

import * as DraggableComponentsActions from '../actions/draggable.actions';

export interface State {
  isSmoothed: boolean,
  currentListNumber: number,
  scrolledPageSize: string,
  factor: number
};

export const initialState: State = {
  isSmoothed: false,
  currentListNumber: 0,
  scrolledPageSize: '0px',
  factor: 0
};

const draggableReducer = createReducer(
  initialState,
  on(DraggableComponentsActions.isSmoothed, (state: State, props) => ({ ...state, isSmoothed: props.isSmoothed })),
  on(DraggableComponentsActions.currentListNumber, (state: State) => ({ ...state, currentListNumber: state.currentListNumber })),
  on(DraggableComponentsActions.scrolledPageSize, (state: State) => ({ ...state, scrolledPageSize: state.scrolledPageSize })),
  on(DraggableComponentsActions.factor, (state: State) => ({ ...state, factor: state.factor }))
);

export function reducer(state: State | undefined, action: Action) {
  return draggableReducer(state, action);
}