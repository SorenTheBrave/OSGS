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
        const boardStateCopy = game.boardState.map(arr => arr.map(x => { return { value: x, visited: false } }));
        let stringInfo = { liberties: 0, eyes: 0 };
        determineLibertiesAndEyes(boardStateCopy, stringInfo, x, y, color);
        console.log(stringInfo);
        return stringInfo;
    }
    return false;
}

const createGame = (boardSize) => {
    return { "boardState": goban(boardSize), turn: STONE.BLACK, lastMove: undefined }
}

// recursively determines the liberties and eyes for some stone or string of stones
function determineLibertiesAndEyes(boardState, stringInfo, x, y, color) {
    boardState[x][y].visited = true;
    checkNeighboringStone(boardState, stringInfo, x, y + 1, color);
    checkNeighboringStone(boardState, stringInfo, x + 1, y, color);
    checkNeighboringStone(boardState, stringInfo, x, y - 1, color);
    checkNeighboringStone(boardState, stringInfo, x - 1, y, color);
    return stringInfo;
}

function isEye(boardState, x, y, color) {
    return (!boardState[x][y + 1] || boardState[x][y + 1].value === color)
        && (!boardState[x + 1] || (boardState[x + 1][y].value === color))
        && (!boardState[x][y - 1] || boardState[x][y - 1].value === color)
        && (!boardState[x - 1] || (boardState[x - 1][y].value === color));
}

function checkNeighboringStone(boardState, stringInfo, x, y, color) {
    if (boardState[x] && boardState[x][y]) {
        if (boardState[x][y].value === color && !boardState[x][y].visited) {
            stringInfo = determineLibertiesAndEyes(boardState, stringInfo, x, y, color);
        }
        if (boardState[x][y].value === -1 && !boardState[x][y].visited)  {
            stringInfo.liberties ++;
            stringInfo.eyes = isEye(boardState, x, y, color)
                ? stringInfo.eyes + 1
                : stringInfo.eyes;
            boardState[x][y].visited = true;
        }
    }
}

export { createGame, makePotentialMove };