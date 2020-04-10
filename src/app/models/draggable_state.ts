export interface State {
  isSmoothed: boolean;
  currentListNumber: number;
  scrollTopSizeList: number;
  scrolledPageSize: string;
  factor: number;
  subLists: SubList[];
  listCount: number;
  clickedSubList: string;
  clickedCard: string;
}