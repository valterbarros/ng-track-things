import { createAction, props } from '@ngrx/store';

export const isSmoothed = createAction('[Draggable Components] is smoothed', props<{ isSmoothed: boolean; }>());
export const currentListNumber = createAction('[Draggable Components] currentListNumber', props<{ currentListNumber:  number; }>());
export const scrollTopSizeList = createAction('[Draggable Components] scrollTopSizeList', props<{ scrollTopSizeList:  number; }>());
export const factor = createAction('[Draggable Components] factor', props<{ factor:  number; }>());