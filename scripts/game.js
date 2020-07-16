import { drawBoard } from '../modules/board.js';

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

window.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById('boardCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.webkitImageSmoothingEnabled = false;
        ctx.mozImageSmoothingEnabled = false;
        ctx.imageSmoothingEnabled = false;
        drawBoard(ctx, document.getElementById("boardContainer").clientWidth);
        window.onresize = function() {
             drawBoard(document.getElementById("boardCanvas").getContext('2d'), document.getElementById("boardContainer").clientWidth, ctx.strokeStyle);
        }
    }

    let styleSelect = document.getElementById("style")
    styleSelect.addEventListener("change", changeBoardStyle);
});

function changeBoardStyle() {
    console.log(document.getElementById("style").value);
    let ctx = document.getElementById('boardCanvas').getContext('2d');
    switch (document.getElementById("style").value) {
        case "Maple":
            document.getElementById("boardCanvas").style.setProperty("background-color", BOARD_STYLES.MAPLE.background);
            drawBoard(ctx, document.getElementById("boardContainer").clientWidth, BOARD_STYLES.MAPLE.stroke)
            break;
        case "Rosewood":
            document.getElementById("boardCanvas").style.setProperty("background-color", BOARD_STYLES.ROSEWOOD.background);
            drawBoard(ctx, document.getElementById("boardContainer").clientWidth, ctx.strokeStyle = BOARD_STYLES.ROSEWOOD.stroke)
            break;
        case "Mahogany":
            document.getElementById("boardCanvas").style.setProperty("background-color", BOARD_STYLES.MAHOGANY.background);
            drawBoard(ctx, document.getElementById("boardContainer").clientWidth, BOARD_STYLES.MAHOGANY.stroke)
            break;
        default:
            break;
    }
}

