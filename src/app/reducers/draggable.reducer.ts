import {
  createReducer,
  Action,
  on
} from '@ngrx/store';

import * as DraggableComponentsActions from '../actions/draggable.actions';
import { SubList } from '../models/sub-lists-model'; 

export interface State {
  isSmoothed: boolean,
  currentListNumber: number,
  scrollTopSizeList: number,
  scrolledPageSize: string,
  factor: number,
  subLists: SubList[],
  listCount: number
};

export const initialState: State = {
  isSmoothed: false,
  currentListNumber: 0,
  scrollTopSizeList: 0,
  scrolledPageSize: '0px',
  factor: 0,
  subLists: [],
  listCount: 0
};

const draggableReducer = createReducer(
  initialState,
  on(DraggableComponentsActions.isSmoothed, (state: State, props) => ({ ...state, isSmoothed: props.isSmoothed })),
  on(DraggableComponentsActions.currentListNumber, (state: State, props) => ({ ...state, currentListNumber: props.currentListNumber })),
  on(DraggableComponentsActions.scrollTopSizeList, (state: State, props) => ({ ...state, scrollTopSizeList: props.scrollTopSizeList })),
  on(DraggableComponentsActions.scrolledPageSize, (state: State, props) => ({ ...state, scrolledPageSize: props.scrolledPageSize })),
  on(DraggableComponentsActions.factor, (state: State, props) => ({ ...state, factor: props.factor })),
  on(DraggableComponentsActions.subList, (state: State, props) => ({ ...state, subLists: [...state.subLists, props.subList] })),
  on(DraggableComponentsActions.resetSubList, (state: State) => ({ ...state, subLists: [] })),
  on(DraggableComponentsActions.listCount, (state: State) => ({ ...state, listCount: state.listCount + 1 })),
);

export function reducer(state: State | undefined, action: Action) {
  return draggableReducer(state, action);
}