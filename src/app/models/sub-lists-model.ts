interface Card {
  id: number,
  name: string
}

export interface SubList {
  id: number,
  title: string,
  cards: Card[]
}