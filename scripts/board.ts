import type { BoardCanvasPair, BoardSize, Coordinate } from "./play.ts";

/**
 * Handle visual elements of updating a goban (creation, playing moves, toggle coordinates, etc.)
 *
 * If it handles any DOM management for a goban, it probably belongs here.
 */

type BoardStyles = {
    MAPLE: {
        background: "#edb87b",
        stroke: "#000000"
    },
    ROSEWOOD: {
        //background: "#36050b",
        background: "#6f362c",
        stroke: "#ffffff"
    },
    MAHOGANY: {
        background: "#b36430",
        stroke: "#000000"
    }
}

function createBoard(container: HTMLDivElement): HTMLCanvasElement {
    const newBoard = document.createElement("canvas");
    newBoard.classList.add("board");
    container.appendChild(newBoard);
    return newBoard;
}

function createBoardOverlay(container: HTMLDivElement): HTMLCanvasElement {
    const newBoard = document.createElement("canvas");
    newBoard.classList.add("move-preview");
    container.appendChild(newBoard);
    return newBoard;
}

function drawNewBoard(board: BoardCanvasPair): void {
    drawGrid(board.game,board.size);
}

// Just draw the lines based on the given size
function drawGrid(canvas: HTMLCanvasElement, size: BoardSize): void {

}

// star points, or Hoshi, are the evenly-spaced "dots" at certain spots on the board
function drawStarPoints(): void {

}

// Label the columns A-T (skip I to avoid confusion with J) and the rows 1-19
// may need to add a property to the game state for "showingCoordinates" or something
function toggleCoordinates(): void {

}

// prepare the padding based on the container. the container DOM elem should have a unique id related to the BoardState's id
function setBoardPadding(board: BoardCanvasPair): void {

}

// just visually represent one stone being placed (this should also handle removing captured stones)
function drawStone(canvas: HTMLCanvasElement, move: Coordinate): void {


    // ...
    // if(thisIsACapturingMove) {
    //   removeCaptures(canvas, listOfCapturedStones);
    // }
}

function removeCaptures(canvas: HTMLCanvasElement, captured: Array<Coordinates>): void {

}

// replace 'any' with some style configuration element chosen from the UI from an onchange event
function setStyle(canvas: HTMLCanvasElement, style: any): void {

}

// player clicked the 'pass' button
// play a 'ding' sound effect? display 'passed'?
// AGA rules - opponent gets +1 capture
function pass() {

}

// Player resigns. Update both server and UI of this (in that order, requiring confirmation)
function resign() {

}

// Update the move preview on hover (should warn on illegal moves, preview move for legal moves)
function handleMovePreview(e: MouseEvent) {

}

// Player clicked the board, trying to make a move. Either refuse and warn for illegal move, or update if legal.
// Update both server and UI of this (in that order, requiring confirmation)
function handleMove(e: MouseEvent) {
    if((e.buttons & 1) === 1) {

    }
}

// should handle mouse OR kb event where the user indicates they'd like to move backwards in the game tree
function navigatePrev(e: UIEvent): void {

}

// should handle mouse OR kb event where the user indicates they'd like to move forwards in the game tree
// just worry about scenarios where GameTreeNode has 1 child, or where you always assume you want to go to the first
// child if there are multiple.
function navigateNext(e: UIEvent): void {

}

export { createBoard, createBoardOverlay, drawNewBoard }