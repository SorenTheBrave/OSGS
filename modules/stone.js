const STONE =  {
    WHITE: 1,
    BLACK: 2
}

/*
   Draws a stone with the given color and radius at the given coordinates x, y
   (with optional padding) using the given 2d canvas context
 */
function drawStone(color, ctx, x, y, r, padding=10) {
    let gradient = ctx.createRadialGradient(
        x,
        y,
        2,
        x,
        y,
        25
    );

    if (color === STONE.WHITE) {
        ctx.fillStyle = '#ffffff';
        gradient.addColorStop(0, '#ffffff');
        gradient.addColorStop(0.4, '#ebebeb');
    } else {
        ctx.fillStyle = '#000000';
        gradient.addColorStop(0, '#383838');
        gradient.addColorStop(0.4, '#000000');
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