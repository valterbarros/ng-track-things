import { createAction, props } from '@ngrx/store';
import { SubList } from '../models/sub-lists-model';

export const isSmoothed = createAction('[Draggable Components] is smoothed', props<{ isSmoothed: boolean; }>());
export const currentListNumber = createAction('[Draggable Components] currentListNumber', props<{ currentListNumber: number; }>());
export const scrollTopSizeList = createAction('[Draggable Components] scrollTopSizeList', props<{ scrollTopSizeList: number; }>());
export const scrolledPageSize = createAction('[Draggable Components] scrolledPageSize', props<{ scrolledPageSize: string; }>());
export const factor = createAction('[Draggable Components] factor', props<{ factor: number; }>());
export const requestSublist = createAction('[Draggable Components] requestSublist', props<{ listId: string; }>());
export const subList = createAction('[Draggable Components] subList', props<{ subList: SubList; }>());
export const resetSubList = createAction('[Draggable Components] reset subList');
export const listCount = createAction('[Draggable Components] listCount');
export const reorderCards = createAction(
  '[Draggable Components] reorderCards',
  props<{list: {fromId: string, toId: string}, oldIndex: number, newIndex: number}>()
);
export const clickedSubList = createAction('[Draggable Components] clickedSubList', props<{ clickedSubList: string; }>());
export const clickedCard = createAction('[Draggable Components] clickedCard', props<{ clickedCard: string; }>());
export const cardInfoModalVisible = createAction(
  '[Draggable Components] cardInfoModalVisible', props<{ cardInfoModalVisible: boolean; }>()
);
