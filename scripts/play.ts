import { createBoard, createBoardOverlay, paintDefaultBoard } from "./board.ts";

interface BoardCanvasPair {
    id: number,
    game: HTMLCanvasElement,
    overlay: HTMLCanvasElement
}

let boardCount = 0;
const activeBoards: Array<BoardCanvasPair> = [];

function setupBoard(playArea: HTMLDivElement): void {
    const testBoard: HTMLCanvasElement = createBoard(playArea);
    testBoard.classList.add(`board-canvas-${boardCount}`);

    const overlay: HTMLCanvasElement = createBoardOverlay(playArea);

    paintDefaultBoard(testBoard, 19); // stub
    activeBoards.push({"id": boardCount,"game": testBoard, "overlay": overlay});
    boardCount++;
}

window.document.addEventListener("load", function() {
    const playArea: HTMLDivElement = window.document.querySelector("div.boardContainer") as HTMLDivElement;
    setupBoard(playArea);
});