enum Stone {
  EMPTY,
  BLACK,
  WHITE
}
type BoardState = Array<Array<Coordinate>>;
type BoardSize = 9 | 13 | 19;

interface Coordinate {
  row: number,
  col: number,
  state: Stone.EMPTY | Stone.BLACK | Stone.WHITE
}

export type { Coordinate, BoardState, BoardSize }
export { Stone }