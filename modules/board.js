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

/* draws a board of the given size and padding using the given 2d canvas context */
export function drawBoard(ctx, size, lineColor="#000000", padding=10) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.canvas.width = size > Globals.MAX_BOARD_SIZE
        ? Globals.MAX_BOARD_SIZE
        : size;
    ctx.canvas.height = size > Globals.MAX_BOARD_SIZE
        ? Globals.MAX_BOARD_SIZE
        : size;
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = lineColor;
    const squareWidth = (ctx.canvas.width - (2 * padding)) / (Globals.STANDARD_GOBAN_SIZE - 1)
    for (let i = 0; i <= Globals.STANDARD_GOBAN_SIZE; i ++) {
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
    drawCircles(ctx, ctx.canvas.width, squareWidth, padding);
    drawTestStones(ctx, squareWidth);
}

function drawCircles(ctx, size, squareWidth, padding) {
    drawCircle(ctx, (squareWidth * 4) + padding, (squareWidth * 4) + padding); // top left
    drawCircle(ctx, size / 2, (squareWidth * 4) + padding); // top middle
    drawCircle(ctx, size - (squareWidth * 4) - padding, (squareWidth * 4) + padding); // top right

    drawCircle(ctx, (squareWidth * 4) + padding, size / 2); // middle left
    drawCircle(ctx, size / 2, size / 2); // middle
    drawCircle(ctx, size - (squareWidth * 4) - padding, size / 2); // middle right

    drawCircle(ctx, (squareWidth * 4) + padding, size - (squareWidth * 4) - padding); // lower left
    drawCircle(ctx, size / 2, size - (squareWidth * 4) - padding); // lower middle
    drawCircle(ctx, size - (squareWidth * 4) - padding, size - (squareWidth * 4) - padding); // lower right
}

function drawCircle(ctx, x, y) {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI); // TODO: dynamically set circle radius, especially for smaller boards
    ctx.stroke();
    ctx.fill();
}

function drawTestStones(ctx, squareWidth) {
    // just drawing some random stones
    drawStone(STONE.BLACK, ctx, squareWidth, squareWidth, squareWidth / 2);
    drawStone(STONE.WHITE, ctx, 2 * squareWidth, squareWidth, squareWidth / 2);
    drawStone(STONE.BLACK, ctx, squareWidth, squareWidth * 2, squareWidth / 2);
    drawStone(STONE.WHITE, ctx, 2 * squareWidth, 2 * squareWidth, squareWidth / 2);
    drawStone(STONE.BLACK, ctx, 2 * squareWidth, 3 * squareWidth, squareWidth / 2);
}
