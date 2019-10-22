import { createAction, props } from '@ngrx/store';

export const isSmoothed = createAction('[Draggable Components] is smoothed', props<{ isSmoothed: boolean; }>());
export const currentListNumber = createAction('[Draggable Components] currentListNumber');
export const scrolledPageSize = createAction('[Draggable Components] scrolledPageSize');
export const factor = createAction('[Draggable Components] factor');