import {
  createReducer,
  Action,
  on
} from '@ngrx/store';

import * as DraggableComponentsActions from '../actions/draggable.actions';

export interface State {
  isSmoothed: boolean,
  currentListNumber: number,
  scrollTopSizeList: number,
  factor: number
};

export const initialState: State = {
  isSmoothed: false,
  currentListNumber: 0,
  scrollTopSizeList: 0,
  factor: 0
};

const draggableReducer = createReducer(
  initialState,
  on(DraggableComponentsActions.isSmoothed, (state: State, props) => ({ ...state, isSmoothed: props.isSmoothed })),
  on(DraggableComponentsActions.currentListNumber, (state: State, props) => ({ ...state, currentListNumber: props.currentListNumber })),
  on(DraggableComponentsActions.scrollTopSizeList, (state: State, props) => ({ ...state, scrollTopSizeList: props.scrollTopSizeList })),
  on(DraggableComponentsActions.factor, (state: State, props) => ({ ...state, factor: props.factor }))
);

export function reducer(state: State | undefined, action: Action) {
  return draggableReducer(state, action);
}