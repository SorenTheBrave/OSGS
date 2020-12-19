import { BOARD_STYLES, Board } from './board.js';
import { Globals } from "../config/globals.js";
import {STONE} from "./stone.js";

let currentBoard = Globals.GOBAN_BOARDS.STANDARD;
let currentWood = BOARD_STYLES.MAPLE.background;
let currentStroke = BOARD_STYLES.MAPLE.stroke;

export class TestBoard {

    constructor(styleId, dimensionId) {
        this.styleId = styleId;
        this.dimensionId = dimensionId;
        this.board = new Board(
            document.getElementById("boardCanvas"),
            document.getElementById("movePreviewCanvas"),
            document.getElementById("boardContainer"),
            Globals.GOBAN_BOARDS.STANDARD,
            BOARD_STYLES.MAPLE.stroke
        );

        let styleSelect = document.getElementById(this.styleId)
        let objectScope = this;
        if (styleSelect) {
            styleSelect.addEventListener("change", function() { objectScope.changeBoardStyle(objectScope.board.boardCanvasContext, objectScope.board.boardCanvas, styleSelect) });
        }

        let dimensionSelect = document.getElementById(this.dimensionId)
        if (dimensionSelect) {
            dimensionSelect.addEventListener("change", function() { objectScope.changeBoardDimensions(objectScope.board.boardCanvasContext, objectScope.board.boardCanvas, dimensionSelect) });
        }
    }

    changeBoardStyle(ctx, canvas, styleEl) {
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
        document.getElementById("boardCanvas").innerHTML = "";
        this.board = new Board(
            document.getElementById("boardCanvas"),
            document.getElementById("movePreviewCanvas"),
            document.getElementById("boardContainer"),
            currentBoard,
            currentStroke
        );
    }

    changeBoardDimensions(ctx, canvas, dimensionEl) {
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
        this.board = new Board(
            document.getElementById("boardCanvas"),
            document.getElementById("movePreviewCanvas"),
            document.getElementById("boardContainer"),
            currentBoard,
            currentStroke
        );
    }
}
