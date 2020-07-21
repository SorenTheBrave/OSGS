import { Globals } from '../config/globals.js'
import { drawStone, STONE } from "./stone.js";
import { createGame, makePotentialMove } from "./game.js";

const BOARD_STYLES = {
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


// if constructed, will create a board on the given canvas that is within the given container
class Board {
    constructor(boardCanvas, previewCanvas, container, boardType=Globals.GOBAN_BOARDS.STANDARD, strokeColor=BOARD_STYLES.MAPLE.stroke) {
        this.game = createGame(boardType.DIMENSION);

        if (boardCanvas && previewCanvas) {
            let boardCanvasContext = boardCanvas.getContext('2d');
            let previewCanvasContext = previewCanvas.getContext('2d');

            boardCanvasContext.clearRect(0, 0, boardCanvas.width, boardCanvas.height);
            previewCanvasContext.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

            //setRandomStoneState(this.game.boardState) /* TESTING */

            let measurements = drawBoard(
                boardCanvas,
                boardCanvasContext,
                previewCanvas,
                previewCanvasContext,
                this.game,
                container.clientWidth,
                boardType,
                strokeColor
            );
            attachMovePreviewListener(
                previewCanvas,
                previewCanvasContext,
                boardType,
                strokeColor,
                measurements.squareWidth,
                measurements.padding,
                STONE.BLACK
            )
            attachMoveListener(
                boardCanvas,
                boardCanvasContext,
                previewCanvas,
                previewCanvasContext,
                this.game,
                boardType,
                strokeColor,
                measurements.squareWidth,
                measurements.padding,
                STONE.BLACK
            );
            let objectScope = this;
            window.onresize = function() {
                measurements = drawBoard(
                    boardCanvas,
                    boardCanvasContext,
                    previewCanvas,
                    previewCanvasContext,
                    objectScope.game,
                    container.clientWidth,
                    boardType,
                    strokeColor
                );
                attachMovePreviewListener(
                    previewCanvas,
                    previewCanvasContext,
                    boardType,
                    strokeColor,
                    measurements.squareWidth,
                    measurements.padding,
                    STONE.BLACK
                )
                attachMoveListener(
                    boardCanvas,
                    boardCanvasContext,
                    previewCanvas,
                    previewCanvasContext,
                    objectScope.game,
                    previewCanvas,
                    previewCanvasContext,
                    boardType,
                    strokeColor,
                    measurements.squareWidth,
                    measurements.padding,
                    STONE.BLACK
                );
            }
        }
    }
}

/* draws a board of the given size using the given 2d canvas context */
function drawBoard(
    boardCanvas,
    boardCtx,
    previewCanvas,
    previewCtx,
    game,
    canvasSize,
    boardParams=Globals.GOBAN_BOARDS.STANDARD,
    lineColor="#000000",
) {
    boardCanvas.height = canvasSize > document.getElementById("boardContainer").clientHeight
        ? document.getElementById("boardContainer").clientHeight
        : canvasSize;
    boardCanvas.width = boardCanvas.height;

    previewCanvas.width = boardCanvas.width; // set the canvas for displaying move previews to the same dimensions as the board
    previewCanvas.height = boardCanvas.height;

    boardCtx.strokeStyle = lineColor;
    boardCtx.fillStyle = lineColor;
    const squareWidth = (boardCanvas.width) / (boardParams.DIMENSION - 1 + (2 * Globals.PADDING_MULTIPLIER));
    const padding = Globals.PADDING_MULTIPLIER * squareWidth; // this many squares worth of padding to the edge of the board
    for (let i = 0; i <= boardParams.DIMENSION; i ++) {
        // start in the middle of the canvas and alternate outwards. first vertically, then horizontally.
        if (i % 2 === 0) {
            boardCtx.beginPath()
            boardCtx.moveTo((boardCanvas.width / 2) - ((i / 2) * squareWidth), padding);
            boardCtx.lineTo((boardCanvas.width / 2) - ((i / 2) * squareWidth), boardCanvas.height - padding);
            boardCtx.stroke();

            boardCtx.beginPath();
            boardCtx.moveTo(padding, (boardCanvas.height / 2) - ((i / 2) * squareWidth));
            boardCtx.lineTo(boardCanvas.width - padding, (boardCanvas.height / 2) - ((i / 2) * squareWidth));
            boardCtx.stroke();
        } else {
            boardCtx.beginPath();
            boardCtx.moveTo((boardCanvas.width / 2) + (Math.floor(i / 2) * squareWidth), padding);
            boardCtx.lineTo((boardCanvas.width / 2) + (Math.floor(i / 2) * squareWidth), boardCanvas.height - padding);
            boardCtx.stroke();

            boardCtx.beginPath();
            boardCtx.moveTo(padding, (boardCanvas.height / 2) + (Math.floor(i / 2) * squareWidth));
            boardCtx.lineTo(boardCanvas.width - padding, (boardCanvas.height / 2) + (Math.floor(i / 2) * squareWidth));
            boardCtx.stroke();
        }
    }
    drawStarPoints(boardCtx, boardCanvas.width, boardParams.DIMENSION, squareWidth, padding);
    drawCurrentStoneState(boardCtx, game.boardState, boardParams, padding, squareWidth);
    return { "squareWidth": squareWidth, "padding": padding };
}

// TODO: refactor this somehow?
function drawStarPoints(ctx, size, dimension, squareWidth, padding) {
    switch (dimension) {
        case 19:
            drawStarPoint(ctx, (squareWidth * 4) + padding, (squareWidth * 4) + padding); // top left
            drawStarPoint(ctx, size / 2, (squareWidth * 4) + padding); // top middle
            drawStarPoint(ctx, size - (squareWidth * 4) - padding, (squareWidth * 4) + padding); // top right

            drawStarPoint(ctx, (squareWidth * 4) + padding, size / 2); // middle left
            drawStarPoint(ctx, size / 2, size / 2); // middle
            drawStarPoint(ctx, size - (squareWidth * 4) - padding, size / 2); // middle right

            drawStarPoint(ctx, (squareWidth * 4) + padding, size - (squareWidth * 4) - padding); // lower left
            drawStarPoint(ctx, size / 2, size - (squareWidth * 4) - padding); // lower middle
            drawStarPoint(ctx, size - (squareWidth * 4) - padding, size - (squareWidth * 4) - padding); // lower right
            break;
        case 13:
            drawStarPoint(ctx, (squareWidth * 3) + padding, (squareWidth * 3) + padding); // top left
            drawStarPoint(ctx, size - (squareWidth * 3) - padding, (squareWidth * 3) + padding); // top right
            drawStarPoint(ctx, size / 2, size / 2); // middle
            drawStarPoint(ctx, (squareWidth * 3) + padding, size - (squareWidth * 3) - padding); // bottom left
            drawStarPoint(ctx, size - (squareWidth * 3) - padding, size - (squareWidth * 3) - padding); // bottom right
            break;
        case 9:
            drawStarPoint(ctx, (squareWidth * 2) + padding, (squareWidth * 2) + padding); // top left
            drawStarPoint(ctx, size - (squareWidth * 2) - padding, (squareWidth * 2) + padding); // top right
            drawStarPoint(ctx, size / 2, size / 2); // middle
            drawStarPoint(ctx, (squareWidth * 2) + padding, size - (squareWidth * 2) - padding); // bottom left
            drawStarPoint(ctx, size - (squareWidth * 2) - padding, size - (squareWidth * 2) - padding); // bottom right
            break;
        default:
            break;
    }
}

function drawStarPoint(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, 2 * Math.PI); // TODO: dynamically set circle radius, especially for smaller boards
    ctx.stroke();
    ctx.fill();
}

function drawCurrentStoneState(ctx, goban, params, padding, squareWidth) {
    for (let i = 0; i < params.DIMENSION; i++) {
        for (let j = 0; j < goban[i].length; j++) {
            if (goban[i][j] !== 0) {
                drawStone(
                    goban[i][j],
                    ctx,
                    i * squareWidth,
                    j * squareWidth,
                    squareWidth / 2,
                    padding,
                    params.STONE_GRADIENT_RADII,
                    params.STONE_GRADIENT_OFFSET);
            }
        }
    }
}

function drawPreviewStone(ctx, color, x, y, squareWidth, padding, stoneGradientRadii, stoneGradientOffset) {
    drawStone(
        color,
        ctx,
        x * squareWidth,
        y * squareWidth,
        squareWidth / 2,
        padding,
        stoneGradientRadii,
        stoneGradientOffset,
        Globals.PREVIEW_STONE_OPACITY);
}

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function attachMoveListener(boardCanvas, boardCtx, previewCanvas, previewCtx, game, boardParams, strokeColor, squareWidth, padding, turnColor) {
    if (previewCanvas.moveListener) { // remove any existing listeners referencing other boards within the same canvas
        previewCanvas.removeEventListener("click", previewCanvas.moveListener, false);
    }
    previewCanvas.addEventListener('click', previewCanvas.moveListener = function getMovePosition(e) {
        const mousePos = getMousePos(previewCanvas, e);
        const potentialStonePosX = Math.round(mousePos.x / squareWidth - Globals.PADDING_MULTIPLIER);
        const potentialStonePosY = Math.round(mousePos.y / squareWidth - Globals.PADDING_MULTIPLIER);

        if ((potentialStonePosX >= 0 && potentialStonePosY >= 0) && (potentialStonePosX < boardParams.DIMENSION && potentialStonePosY < boardParams.DIMENSION)) {
            let madeValidMove = makePotentialMove(game, potentialStonePosX, potentialStonePosY, turnColor);
            if (madeValidMove) {
                drawBoard(boardCanvas, boardCtx, previewCanvas, previewCtx, game, boardCanvas.width, boardParams, strokeColor);
                attachMoveListener(boardCanvas, boardCtx, previewCanvas, previewCtx, game, boardParams, strokeColor, squareWidth, padding, game.turn);
                attachMovePreviewListener(previewCanvas, previewCtx, boardParams, strokeColor, squareWidth, padding, game.turn);
            }
        }
    }, false);
}

function attachMovePreviewListener(canvas, ctx, boardParams, strokeColor, squareWidth, padding, turnColor) {
    if (canvas.previewListener) { // remove any existing listeners referencing other boards within the same canvas
        canvas.removeEventListener("mousemove", canvas.previewListener, false);
    }
    canvas.addEventListener('mousemove', canvas.previewListener = function getPotentialStonePosition(e) {
        const mousePos = getMousePos(canvas, e);
        const potentialStonePosX = Math.round(mousePos.x / squareWidth - Globals.PADDING_MULTIPLIER);
        const potentialStonePosY = Math.round(mousePos.y / squareWidth - Globals.PADDING_MULTIPLIER);

        if ((potentialStonePosX >= 0 && potentialStonePosY >= 0) && (potentialStonePosX < boardParams.DIMENSION && potentialStonePosY < boardParams.DIMENSION)) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawPreviewStone(
                ctx,
                turnColor,
                potentialStonePosX,
                potentialStonePosY,
                squareWidth,
                padding,
                boardParams.STONE_GRADIENT_RADII,
                boardParams.STONE_GRADIENT_OFFSET
            );
            document.getElementById("mousePos").innerText = potentialStonePosX + ', ' + potentialStonePosY;
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            document.getElementById("mousePos").innerText = 'N/A';
        }
    }, false);
}

export { BOARD_STYLES, Board }
