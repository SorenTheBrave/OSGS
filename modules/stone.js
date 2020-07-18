import {Globals} from "../config/globals.js";

const STONE =  {
    WHITE: 1,
    BLACK: 2
}

/*
   Draws a stone with the given color and radius at the given coordinates x, y
   (with optional padding) using the given 2d canvas context
 */
function drawStone(color, ctx, x, y, r, padding, stoneGradientRadii, stoneGradientOffset, opacity=1) {
    let gradient = ctx.createRadialGradient(
        x + (padding - stoneGradientOffset),
        y + (padding - stoneGradientOffset),
        stoneGradientRadii[0],
        x + (padding - stoneGradientOffset),
        y + (padding - stoneGradientOffset),
        stoneGradientRadii[1]
    );

    if (color === STONE.WHITE) {
        gradient.addColorStop(0, 'rgba(255, 255, 255, ' + opacity + ')');
        gradient.addColorStop(0.4, 'rgba(235, 235, 235, ' + opacity + ')');
    } else {
        gradient.addColorStop(0, 'rgba(56, 56, 56,' + opacity + ')');
        gradient.addColorStop(0.4, 'rgba(0, 0, 0,' + opacity + ')');
    }

    ctx.fillStyle = gradient;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
    ctx.shadowBlur = 4;

    ctx.beginPath();
    ctx.arc(x + padding, y + padding, r, 0, 2 * Math.PI);
    ctx.fill();
}

export { STONE, drawStone };