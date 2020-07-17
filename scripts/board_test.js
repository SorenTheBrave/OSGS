import { drawBoard, BOARD_STYLES } from '../modules/board.js';
import { Globals } from "../config/globals.js";

let currentBoard = Globals.GOBAN_BOARDS.STANDARD;
let currentWood = BOARD_STYLES.MAPLE.background;
let currentStroke = BOARD_STYLES.MAPLE.stroke;

export class TestBoard {
    constructor(canvasId, containerId, styleId, dimensionId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        let moduleScope = this;
        window.addEventListener("DOMContentLoaded", function() {
            if (moduleScope.canvas) {
                moduleScope.ctx.webkitImageSmoothingEnabled = false;
                moduleScope.ctx.mozImageSmoothingEnabled = false;
                moduleScope.ctx.imageSmoothingEnabled = false;
                let squareWidth = drawBoard(moduleScope.ctx, document.getElementById(containerId).clientWidth, currentBoard, currentStroke);
                attachMovePreviewListener(moduleScope.canvas, squareWidth);
                window.onresize = function() {
                    moduleScope.canvas.removeEventListener("mousemove", moduleScope.canvas.previewListener, false);
                    squareWidth = drawBoard(moduleScope.ctx, document.getElementById(containerId).clientWidth, currentBoard, currentStroke);
                    attachMovePreviewListener(moduleScope.canvas, squareWidth);
                }


                //.addEventListener('click', function(e) { placeStone() });
            }

            let styleSelect = document.getElementById(styleId)
            if (styleSelect) {
                styleSelect.addEventListener("change", function() { changeBoardStyle(moduleScope.ctx, moduleScope.canvas, styleSelect) });
            }

            let dimensionSelect = document.getElementById(dimensionId)
            if (dimensionSelect) {
                dimensionSelect.addEventListener("change", function() { changeBoardDimensions(moduleScope.ctx, moduleScope.canvas, dimensionSelect) });
            }
        });

    }
}

function attachMovePreviewListener(canvas, squareWidth) {
    canvas.addEventListener('mousemove', canvas.previewListener = function getPotentialStonePosition(e) {
        const mousePos = getMousePos(canvas, e);
        const potentialStonePosX = Math.round(mousePos.x / squareWidth - Globals.PADDING_MULTIPLIER);
        const potentialStonePosY = Math.round(mousePos.y / squareWidth - Globals.PADDING_MULTIPLIER);

        document.getElementById("mousePos").innerText = 'stone position: ' + potentialStonePosX + ', ' + potentialStonePosY;
        if (potentialStonePosY >= 0 && potentialStonePosY >= 0) {
            //renderPreviewStone(potentialStonePosY, potentialStonePosX)
        }
    }, false);
}

function getMousePos(canvas, evt) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}

function changeBoardStyle(ctx, canvas, styleEl) {
    switch (styleEl.value) {
        case "Maple":
            currentWood = BOARD_STYLES.MAPLE.background;
            currentStroke = BOARD_STYLES.MAPLE.stroke;
            break;
        case "Rosewood":
            currentWood = BOARD_STYLES.ROSEWOOD.background;
            currentStroke = BOARD_STYLES.ROSEWOOD.stroke;
            break;
        case "Mahogany":
            currentWood = BOARD_STYLES.MAHOGANY.background;
            currentStroke = BOARD_STYLES.MAHOGANY.stroke;
            break;
        default:
            break;
    }
    canvas.style.setProperty("background-color", currentWood);
    drawBoard(ctx, document.getElementById("boardContainer").clientWidth, currentBoard, currentStroke);
}

function changeBoardDimensions(ctx, canvas, dimensionEl) {
    switch (dimensionEl.value) {
        case "19":
            currentBoard = Globals.GOBAN_BOARDS.STANDARD
            break;
        case "13":
            currentBoard = Globals.GOBAN_BOARDS.SMALLER
            break;
        case "9":
            currentBoard = Globals.GOBAN_BOARDS.SMALLEST
            break;
        default:
            break;
    }
    let squareWidth = drawBoard(ctx, document.getElementById("boardContainer").clientWidth, currentBoard, currentStroke);
    canvas.removeEventListener("mousemove", canvas.previewListener, false);
    attachMovePreviewListener(canvas, squareWidth);
}

