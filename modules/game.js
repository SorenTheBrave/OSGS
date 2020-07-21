import { STONE } from "./stone.js";

const goban = (size) => {
    let goban = new Array(size);
    for (let i = 0; i < goban.length; i++) {
        goban[i] = new Array(size);
        for (let j = 0; j < goban[i].length; j++) {
            goban[i][j] = 0;
        }
    }
    return goban;
}

const makePotentialMove = (game, x, y, color) => {
    if (x < game.boardState.length && y < game.boardState[x].length && game.boardState[x][y] === 0) {
        game.boardState[x][y] = color;
        game.turn = color === STONE.BLACK
            ? STONE.WHITE : STONE.BLACK;
        return true;
    }
    return false;
}



const createGame = (boardSize) => {
    return { "boardState": goban(boardSize), turn: STONE.BLACK }
}

export { createGame, makePotentialMove };