// The ONLY place for structured object-based utilities.
// this means definiton, customizations or enhancements to simple data structures like TREES, LISTS, SETS, etc.
// Be aware before creating that there may be useful prototypes provided by base libs, e.g. Set is a native class
// that does exactly what you think it does. Don't reinvent the wheel. Extend that mofo instead.
import type { BoardState } from "./play.ts";


class GameTree {
    id: number;
    children: Set<GameTreeNode>;
    constructor(id: number, provided: Set<GameTreeNode> | null | undefined) {
        if (typeof provided === null || typeof provided === undefined) {
            this.children = new Set<GameTreeNode>();
        } else {
            this.children = provided as Set<GameTreeNode>;
        }
        this.id = id;
    }
}

class GameTreeNode {
    children: Set<GameTreeNode>;
    boardState: BoardState;
    constructor(boardState: BoardState, provided: Set<GameTreeNode> | null | undefined) {
        if (typeof provided === null || typeof provided === undefined) {
            this.children = new Set<GameTreeNode>();
        } else {
            this.children = provided as Set<GameTreeNode>;
        }
        this.boardState = boardState;
    }
}

export { GameTree, GameTreeNode }