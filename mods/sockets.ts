import { v4 } from "../deps.ts";
import { tryConnectGame } from "./gamestore.ts"

/**
 * Server-side and universal socket operations. Client side operations go in scripts/sockets.ts
 * some operations share the same name as in the server-side file. Those pair up like you would expect.
 */

enum SockOps {
  PING,
  PONG,
  HELLO,  // Client requests that the server acknowledge it. Respond with new UUID for it to use.
  GOODBYE,// Client signals that it will close the ws imminently.
  SYNTIME,// Client wants to sync game clock. Server responds with its unix timestamp and the number of ms on the clock.
  ACK,   // The server has completed the request.
  PLAYER_CONNECT,    // Player is live in the game.
  PLAYER_DISCONNECT, // Player leaves game.
  PLAY_MOVE, // Register a move. Req content should contain a JSON object matching interface "Coordinate".
  PASS,
  RESIGN,
  REQUEST_UNDO,
  RESUME_GAME, // Signal from server to unpause game clock. Will be ~100-200ms in the future, to account partially for latency.
  PAUSE_GAME, // A player requests to pause the clock
  PANIC,      // Some kind of error occurred, the server will report it to the client. Client should never send.
  QUERY_GAMES,// The client would like a list of active games available. This needs to be efficient. resp content is JSON.
  QUERY_GAMES_STREAM,// Same as above, but keep sending an updated list of results every Xms, where X is the req content.
}

type OSGSSockEvent = {
  op: SockOps,
  clientId: string,
  content?: string,
  gameId?: number, // only optional for PING, PONG, HELLO, GOODBYE, or game queries. After that it is required.
}



/**
 * Main entrypoint for WS event handling. All events will pass through this one function, which delegates work to
 * every other function here.
 *
 * Long term, this should probably be/call a forked process with a few threads to increase interoperability and keep
 * general server latency low.
 */
function routeSocketEvent(ev: OSGSSockEvent): OSGSSockEvent {
  switch (ev.op) {
    case SockOps.HELLO:
      return establishNewConnection();
    case SockOps.PLAYER_CONNECT:
      return playerConnects(ev);
    default:
      return wsPanic(`Request with unknown op code ${ev.op} cannot be handled!`);
  }
}

const assignedClientIds: Set<string> = new Set<string>();
function establishNewConnection(): OSGSSockEvent {
  let newUUID = "";
  let maxRetries = 50;
  do {
    newUUID = v4.generate(); // UUID v4
    maxRetries--;
  } while(maxRetries > 0 && assignedClientIds.has(newUUID));
  if(maxRetries <= 0) throw `unable to generate unique UUID after ${maxRetries} attempts.`;
  return {
    op: SockOps.HELLO,
    clientId: "SERVER",
    content: newUUID
  };
}

function playerConnects(ev: OSGSSockEvent): OSGSSockEvent {
  
  try {
    tryConnectGame(ev);
  } catch (e) {
    return wsPanic(e.message);
  }
  
  return {
    op: SockOps.PLAYER_CONNECT,
    clientId: "SERVER",
    content: "success",
  };
}

function wsPanic(reason: string): OSGSSockEvent {
  return {
    op: SockOps.PANIC,
    clientId: "SERVER",
    content: reason || "unspecified error",
  };
}

export { SockOps, OSGSSockEvent, routeSocketEvent }