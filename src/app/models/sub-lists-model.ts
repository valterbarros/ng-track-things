export interface Card {
  id?: number;
  description?: string;
  name: string;
  order: number;
  sub_list_id: string;
  urlImages?: Array<string>;
}

export interface SubList {
  id: number;
  title: string;
  cards: Card[];
}
