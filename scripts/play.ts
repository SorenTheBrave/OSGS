import { createBoard, createBoardOverlay, drawNewBoard } from "./board.ts";
import { GameTree, GameTreeNode } from "./util.ts";
import type { BoardSize, Coordinate } from "../mods/game-types.ts";
import { Stone, BoardState } from "../mods/game-types.ts";


/**
 * Public interfaces for the mechanical factors of maintaining a game
 *
 * If it orchestrates any game state for a goban, it probably belongs here.
 */

/*
 The board is laid out like this:

    [[  +++++  ],
     [  +++++  ],
     [  +++++  ]]

   so by convention, the first array index indicates the row and the second indicates the column, ya dig?
 */



interface BoardCanvasPair {
  id: number,
  game: HTMLCanvasElement,
  overlay: HTMLCanvasElement,
  size: 9 | 13 | 19,
  state: BoardState
  // TODO: Use GameTreeNode to express multiple paths in analysis mode, for puzzles, etc.
}

// Prepare game state for a brand new game TODO: add optional game state, initialize board w/ it if provided
function goban(size: BoardSize): BoardState {
  const result = new Array<Array<Coordinate>>();
  for (let i = 0; i < size; i++) {
    const inner = new Array<Coordinate>();
    for (let j = 0; j < size; j++) {
      inner.push({
        row: i,
        col: j,
        state: Stone.EMPTY
      });
    }
    result.push(inner);
  }
  return result;
}

// Add a stone to a board. Move should already be verified previously by another function.
// Should defer to another function if it needs to determine a capture
function updateWithMove(board: BoardCanvasPair, move: Coordinate): void {
  // if(moveIsCapture) {
  //   const capturedStones: Array<Coordinate> = captureStones(board.state, move);
  //   removeCaptures(board.stones, capturedStones)
  // } else {
  //   drawStone(board.stones, move);
  // }
}

// Determine which stones are captured by this move. Return empty array for no captures
function captureStones(board: BoardState, move: Coordinate): Array<Coordinate> {
  const captures = new Array<Coordinate>();
  
  // accumulate captures based on state and move
  
  return captures;
}

// Determine the number of liberties of a group, given any one of the stones that make it up.
// Return -1 if the requested coordinate is empty
function determineLiberties(group: Coordinate): number {
  return 42;
}


// Game bootstrapping - The one time this class will impede on board.ts's responsibilities (for now)

let boardCount = 0; // TODO: clean up this stuff polluting global namespace
const activeBoards: Array<BoardCanvasPair> = [];

// Just a hastily put-together demo board on the main page for now
function setupBoard(playArea: HTMLDivElement): void {
  const testBoard: HTMLCanvasElement = createBoard(playArea);
  testBoard.classList.add(`board-canvas-${boardCount}`);
  
  const overlay: HTMLCanvasElement = createBoardOverlay(playArea);
  const demoBoard = {"id": boardCount, "game": testBoard, "overlay": overlay, size: 19} as BoardCanvasPair;
  drawNewBoard(demoBoard);
  activeBoards.push(demoBoard);
  boardCount++;
  console.log(JSON.stringify(activeBoards));
}

function tryWebSocketConnection() {

}

window.onload = () => {
  console.log("bootstrapping test board...");
  const playArea: HTMLDivElement = document.querySelector("div#boardContainer") as HTMLDivElement;
  setupBoard(playArea);
};

export type { BoardCanvasPair }