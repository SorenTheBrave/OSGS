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

function paintDefaultBoard(canvas: HTMLCanvasElement, size: number): void {

}

export { createBoard, createBoardOverlay, paintDefaultBoard }