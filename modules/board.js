import { Globals } from '../config/globals.js'
import { drawStone, STONE } from "./stone.js";


let STANDARD_GOBAN = new Array(19);
for (let i = 0; i < STANDARD_GOBAN.length; i++) {
    STANDARD_GOBAN[i] = new Array(19);
    for (let j = 0; j < STANDARD_GOBAN[i].length; j++) {
        STANDARD_GOBAN[i][j] = 0;
    }
}

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
    constructor(canvas, container, boardType=Globals.GOBAN_BOARDS.STANDARD, strokeColor=BOARD_STYLES.MAPLE.stroke) {
        this.canvas = canvas;
        this.container = container;
        this.containerWidth = container.clientWidth;
        this.boardType = boardType;
        this.strokeColor = strokeColor;
        this.squareWidth = undefined;

        if (this.canvas) {
            this.ctx = this.canvas.getContext('2d');
            this.ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.ctx.webkitImageSmoothingEnabled = false;
            this.ctx.mozImageSmoothingEnabled = false;
            this.ctx.imageSmoothingEnabled = false;
            this.squareWidth = drawBoard(this.canvas, this.ctx, this.containerWidth, this.boardType, this.strokeColor);
            attachMovePreviewListener(this.canvas, this.ctx, this.boardType, this.strokeColor, this.squareWidth, STONE.WHITE);
            let objectScope = this;
            window.onresize = function() {
                this.squareWidth = drawBoard(objectScope.canvas, objectScope.ctx, objectScope.container.clientWidth, objectScope.boardType, objectScope.strokeColor);
                attachMovePreviewListener(objectScope.canvas, objectScope.ctx, objectScope.boardType, objectScope.strokeColor, this.squareWidth, STONE.WHITE);
            }


            //.addEventListener('click', function(e) { placeStone() });
        }

    }

    toggleTurn(color) {
        attachMovePreviewListener(this.canvas, this.ctx, this.boardType, this.strokeColor, this.squareWidth, color);
    }
}

/* draws a board of the given size using the given 2d canvas context */
function drawBoard(
    canvas,
    ctx,
    canvasSize,
    boardParams=Globals.GOBAN_BOARDS.STANDARD,
    lineColor="#000000",
    previewData={ present: false }
) {
    canvas.height = canvasSize > document.getElementById("boardContainer").clientHeight
        ? document.getElementById("boardContainer").clientHeight
        : canvasSize;
    canvas.width = canvas.height;
    ctx.strokeStyle = lineColor;
    ctx.fillStyle = lineColor;
    const squareWidth = (canvas.width) / (boardParams.DIMENSION - 1 + (2 * Globals.PADDING_MULTIPLIER));
    const padding = Globals.PADDING_MULTIPLIER * squareWidth; // this many squares worth of padding to the edge of the board
    for (let i = 0; i <= boardParams.DIMENSION; i ++) {
        // start in the middle of the canvas and alternate outwards. first vertically, then horizontally.
        if (i % 2 === 0) {
            ctx.beginPath()
            ctx.moveTo((canvas.width / 2) - ((i / 2) * squareWidth), padding);
            ctx.lineTo((canvas.width / 2) - ((i / 2) * squareWidth), canvas.height - padding);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(padding, (canvas.height / 2) - ((i / 2) * squareWidth));
            ctx.lineTo(canvas.width - padding, (canvas.height / 2) - ((i / 2) * squareWidth));
            ctx.stroke();
        } else {
            ctx.beginPath();
            ctx.moveTo((canvas.width / 2) + (Math.floor(i / 2) * squareWidth), padding);
            ctx.lineTo((canvas.width / 2) + (Math.floor(i / 2) * squareWidth), canvas.height - padding);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(padding, (canvas.height / 2) + (Math.floor(i / 2) * squareWidth));
            ctx.lineTo(canvas.width - padding, (canvas.height / 2) + (Math.floor(i / 2) * squareWidth));
            ctx.stroke();
        }
    }
    drawStarPoints(ctx, canvas.width, boardParams.DIMENSION, squareWidth, padding);
    if (previewData.present) {
        drawPreviewStone(
            ctx,
            previewData.color,
            previewData.x,
            previewData.y,
            squareWidth,
            padding,
            boardParams.STONE_GRADIENT_RADII,
            boardParams.STONE_GRADIENT_OFFSET
        );
    }
    return squareWidth;
    //drawCurrentStoneDistribution(ctx, squareWidth, padding, boardParams.STONE_GRADIENT_RADII, boardParams.STONE_GRADIENT_OFFSET);
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

function attachMovePreviewListener(canvas, ctx, boardParams, strokeColor, squareWidth, turnColor) {
    if (canvas.previewListener) { // remove any existing listeners referencing other boards within the same canvas
        canvas.removeEventListener("mousemove", canvas.previewListener, false);
    }
    canvas.addEventListener('mousemove', canvas.previewListener = function getPotentialStonePosition(e) {
        const mousePos = getMousePos(canvas, e);
        const potentialStonePosX = Math.round(mousePos.x / squareWidth - Globals.PADDING_MULTIPLIER);
        const potentialStonePosY = Math.round(mousePos.y / squareWidth - Globals.PADDING_MULTIPLIER);

        if ((potentialStonePosX >= 0 && potentialStonePosY >= 0) && (potentialStonePosX < boardParams.DIMENSION && potentialStonePosY < boardParams.DIMENSION)) {
            drawBoard(canvas, ctx, canvas.width, boardParams, strokeColor, {present: true, color: turnColor, x: potentialStonePosX, y: potentialStonePosY});
            document.getElementById("mousePos").innerText = potentialStonePosX + ', ' + potentialStonePosY;
        } else {
            drawBoard(canvas, ctx, canvas.width, boardParams, strokeColor, {present: false });
            document.getElementById("mousePos").innerText = 'N/A';
        }
    }, false);
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

export { BOARD_STYLES, Board }
