import { Globals } from '../config/globals.js'
import {drawStone, STONE} from "./stone.js";

/* TODO: connect with the UI representation
let STANDARD_GOBAN = new Array(19);
for (let i = 0; i < STANDARD_GOBAN.length; i++) {
    STANDARD_GOBAN[i] = new Array(19);
    for (let j = 0; j < STANDARD_GOBAN[i].length; j++) {
        STANDARD_GOBAN[i][j] = 0;
    }
}*/

/* draws a board of the given size using the given 2d canvas context */
export function drawBoard(
    ctx,
    canvasSize,
    boardParams=Globals.GOBAN_BOARDS.STANDARD,
    lineColor="#000000"
) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.canvas.height = canvasSize > document.getElementById("boardContainer").clientHeight
        ? document.getElementById("boardContainer").clientHeight
        : canvasSize;
    ctx.canvas.width = ctx.canvas.height;
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = lineColor;
    const squareWidth = (ctx.canvas.width) / (boardParams.DIMENSION - 1 + (2 * Globals.PADDING_MULTIPLIER));
    const padding = Globals.PADDING_MULTIPLIER * squareWidth; // this many squares worth of padding to the edge of the board
    for (let i = 0; i <= boardParams.DIMENSION; i ++) {
        // start in the middle of the canvas and alternate outwards. first vertically, then horizontally.
        if (i % 2 === 0) {
            ctx.beginPath()
            ctx.moveTo((ctx.canvas.width / 2) - ((i / 2) * squareWidth), padding);
            ctx.lineTo((ctx.canvas.width / 2) - ((i / 2) * squareWidth), ctx.canvas.height - padding);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(padding, (ctx.canvas.height / 2) - ((i / 2) * squareWidth));
            ctx.lineTo(ctx.canvas.width - padding, (ctx.canvas.height / 2) - ((i / 2) * squareWidth));
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo((ctx.canvas.width / 2) + (Math.floor(i / 2) * squareWidth), padding);
            ctx.lineTo((ctx.canvas.width / 2) + (Math.floor(i / 2) * squareWidth), ctx.canvas.height - padding);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(padding, (ctx.canvas.height / 2) + (Math.floor(i / 2) * squareWidth));
            ctx.lineTo(ctx.canvas.width - padding, (ctx.canvas.height / 2) + (Math.floor(i / 2) * squareWidth));
            ctx.stroke();
        }

    }
    drawStarPoints(ctx, ctx.canvas.width, boardParams.DIMENSION, squareWidth, padding);
    drawTestStones(ctx, squareWidth, padding, boardParams.STONE_GRADIENT_RADII, boardParams.STONE_GRADIENT_OFFSET);
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

function drawTestStones(ctx, squareWidth, padding, stoneGradientRadii, stoneGradientOffset) {
    // just drawing some random stones
    drawStone(STONE.BLACK, ctx, squareWidth, squareWidth, squareWidth / 2, padding, stoneGradientRadii, stoneGradientOffset);
    drawStone(STONE.BLACK, ctx, 0, 0, squareWidth / 2, padding, stoneGradientRadii, stoneGradientOffset);
    drawStone(STONE.WHITE, ctx, 0, squareWidth, squareWidth / 2, padding, stoneGradientRadii, stoneGradientOffset);
    drawStone(STONE.WHITE, ctx, 2 * squareWidth, squareWidth, squareWidth / 2, padding, stoneGradientRadii, stoneGradientOffset);
    drawStone(STONE.BLACK, ctx, squareWidth, squareWidth * 2, squareWidth / 2, padding, stoneGradientRadii, stoneGradientOffset);
    drawStone(STONE.WHITE, ctx, 2 * squareWidth, 2 * squareWidth, squareWidth / 2, padding, stoneGradientRadii, stoneGradientOffset);
    drawStone(STONE.BLACK, ctx, 2 * squareWidth, 3 * squareWidth, squareWidth / 2, padding, stoneGradientRadii, stoneGradientOffset);
}
