import { STONE } from "./stone.js";
import { Globals } from "../config/globals.js";

const goban = (size) => {
    let goban = new Array(size);
    for (let i = 0; i < goban.length; i++) {
        goban[i] = new Array(size);
        for (let j = 0; j < goban[i].length; j++) {
            goban[i][j] = -1;
        }
    }
    return goban;
}

const makePotentialMove = (game, x, y, color) => {
    if (x < game.boardState.length && y < game.boardState[x].length && game.boardState[x][y] === -1) {
        game.boardState[x][y] = color;
        game.turn = color === STONE.BLACK
            ? STONE.WHITE : STONE.BLACK;
        const boardStateCopy = game.boardState.map(arr => arr.slice());
        let liberties = determineStoneLiberties(boardStateCopy, x, y, color);
        console.log(liberties);
        return true;
    }
    return false;
}

const createGame = (boardSize) => {
    return { "boardState": goban(boardSize), turn: STONE.BLACK }
}

// recursively determines the liberties remaining for a stone or string of stones
function determineStoneLiberties(boardState, x, y, color) {
    boardState[x][y] = Globals.VISITED;
    let liberties = 0;
    if (boardState[x][y + 1] && boardState[x][y + 1] !== Globals.VISITED) { // spot below
        if (boardState[x][y + 1] === color) {
            liberties += determineStoneLiberties(boardState, x, y + 1, color);
        }
        if (boardState[x][y + 1] === -1)  {
            liberties ++;
            boardState[x][y + 1] = Globals.VISITED;
        }
    }
    if (boardState[x + 1] && boardState[x + 1][y] !== Globals.VISITED) { // spot to the right
        if (boardState[x + 1][y] === color) {
            liberties += determineStoneLiberties(boardState, x + 1, y, color);
        }
        if (boardState[x + 1][y] === -1)  {
            liberties ++;
            boardState[x + 1][y] = Globals.VISITED;
        }
    }
    if (boardState[x][y - 1] && boardState[x][y - 1] !== Globals.VISITED) { // spot above
        if (boardState[x][y - 1] === color) {
            liberties += determineStoneLiberties(boardState, x, y - 1, color);
        }
        if (boardState[x][y - 1] === -1)  {
            liberties ++;
            boardState[x][y - 1] = Globals.VISITED;
        }
    }
    if (boardState[x - 1] && boardState[x - 1][y] !== Globals.VISITED) { // spot to the left
        if (boardState[x - 1][y] === color) {
            liberties += determineStoneLiberties(boardState, x - 1, y, color);
        }
        if (boardState[x - 1][y] === -1)  {
            liberties ++;
            boardState[x - 1][y] = Globals.VISITED;
        }
    }
    return liberties;
}

export { createGame, makePotentialMove };