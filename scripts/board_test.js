import { drawBoard } from '../modules/board.js';
import { Globals } from "../config/globals.js";

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

let currentBoard = Globals.GOBAN_BOARDS.STANDARD;
let currentWood = BOARD_STYLES.MAPLE.background;
let currentStroke = BOARD_STYLES.MAPLE.stroke;

window.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('boardCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        drawBoard(ctx, document.getElementById("boardContainer").clientWidth, currentBoard, currentStroke);
        window.onresize = function() {
             drawBoard(document.getElementById("boardCanvas").getContext('2d'), document.getElementById("boardContainer").clientWidth, currentBoard, currentStroke);
        }
    }

    let styleSelect = document.getElementById("style")
    styleSelect.addEventListener("change", changeBoardStyle);

    let dimensionSelect = document.getElementById("dimension")
    dimensionSelect.addEventListener("change", changeBoardDimensions);
});

function changeBoardStyle() {
    let ctx = document.getElementById('boardCanvas').getContext('2d');
    switch (document.getElementById("style").value) {
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
    document.getElementById("boardCanvas").style.setProperty("background-color", currentWood);
    drawBoard(ctx, document.getElementById("boardContainer").clientWidth, currentBoard, currentStroke);
}

function changeBoardDimensions() {
    let ctx = document.getElementById('boardCanvas').getContext('2d');
    switch (document.getElementById("dimension").value) {
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
    drawBoard(ctx, document.getElementById("boardContainer").clientWidth, currentBoard, currentStroke)
}

