import type { BoardState, Stone } from "./game-types.ts";
import type { OSGSSockEvent } from "./sockets.ts";

/**
 * Backend game management. CRUD API for game state, basically
 */

interface ActiveGame {
  id: number,
  state: BoardState,
  players: Map<Stone,string>[], // UUIDs, to be validated on addition. Value of 0 for EMPTY is illegal.
  spectators?: string[],
  clock: GameClock,
}

interface GameClock {
  gameStart: number
}

let nextGameId = 0;
const gameList: Map<number,ActiveGame> = new Map<number, ActiveGame>();

// Associate a socket with a particular game
function tryConnectGame(ev: OSGSSockEvent): void {

}

export { tryConnectGame };