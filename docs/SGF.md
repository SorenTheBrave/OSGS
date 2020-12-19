### SGF Format for GO developers

First of all, you should check out the following links:

- SGF basics: https://www.red-bean.com/sgf/sgf4.html
- SGF for Go: https://www.red-bean.com/sgf/go.html (Move, Point, Stone)

But I'll briefly cover the basics from there in a more structured way, so you can get to coding with it.

### Point
A point on the Goban (Go board) is a coordinate pair (much like Cartesian coordinate points from your high school
Algebra class) Each Point is made up of the row and column at which point the described move sits on the board. For 
both axes, letters describe each point, their cardinality in the alphabet representing the position on the board. Case
matters. "a..z" maps to 1-26, and "A..Z" maps to 27-52. This server will not strive to represent boards larger than 52.
Each coordinate is wrapped in square brackets like so: `[dd]` thus describes the top left _komoku_ of the board, the 4th
column and 4th row. `[cb]`  Represents the 3-2 point (3rd col, 2nd row) It's essentially a 2D array with an alphabet
indexing scheme.

### Stone
We've discussed how the core data point of the game is represented, but now we need to get into more of the formatting.
A Stone represents a particular Point on the board occupied by a specific color: `(W | B)`. Prepend a Point with one of
these two letters, and you have a Stone! Examples: `B[pd]`, `W[cb]`, `B[kk]`

### Move
As you can imagine, playing a Move involves listing a Stone. And it does. However, Moves can also include other things
in place of or in addition to a stone. Or a move can simply be a single Stone. Here's the highlights:

- Every move begins with a `;`
- `B[]`/`W[]` the empty move '[]' represents a pass.
- Text comments from the players/spectators may be noted as plain text using the 'C' directive inside a Move. This 
  example shows 3 moves, with a comment played after the second move and before the third move:
 ```
;B[fm]
;W[rf]
C[gr8m8: Oh, what a move!]
;B[mk]
  ```

### Analysis and SGF Grouping
SGF allows notation for not only a linear game representation, but also speculative analysis. Because the format is 
defined conceptually as a tree, you can represent multiple "branches", which is useful for facilitating study. Grouping
is the syntactic element that is used to define grouping, notated by parentheses: `(` and `)` To explain this let's
pretend we have a 3x3 board for a moment. You might have a linear game like this:

```
;B[bb]
;W[ab]
;B[cb]
;W[ab]
``` 

...but what if we wanted to include a variation where instead of the third move, B played a corner move instead, and 
then W follows up? we could notate without disturbing the original line of events like so:

```
(;B[bb]
;W[ab]
(;B[cb]
;W[ab]
)(;B[ca]
;W[aa]
))
```

Basically, anytime you see two things surrounded by parens at the same 'level' then either is an existing branch of 
moves, with the first branch being what was played in the actual game (or the 'base' of the game). So here, the
first two moves exist at the top level, so they have no alternatives. Then there's the main 'branch' `;B[cb] ;W[ab]` and
the analysis branch `;B[ca] ;W[aa]`. Parens should match up like function brackets do in code, and if there is any
grouping at all in an SGF, then the top level should be wrapped in parens too, making the top level its own Group.

### SGF headers for game info
At the beginning of the file, you can notate auxiliary information related to the game such as the payer names, ranks, 
counting ruleset, and the outcome (among other things). Here's a list of the most notable directives pertaining to Go:
- `FF`: declare format version. For go, will always be: `FF[4]`
- `GM`: game mode. Go is denoted as 1. Always use: `GM[1]`
- `CA`: character encoding. We should probably use UTF-8 e.g. `CA[UTF-8]`
- `GN`: Name of the game e.g. "Friendly match"
- `DT`: Date the game occurred e.g. 2020-11-13
- `PB`: Name of the black player 
- `PW`: Name of the white player 
- `BR`: Rank of the black player e.g. 5k
- `WR`: Rank of the white player e.g. 2d or 2p (professional dan)
- `TM`: Time settings w/ optional code `O` describing overtime clock e.g. `TM[3000]OT[5x30 byo-yomi]` = 5m + 5x30s
- `SZ`: Board size e.g. 19
- `RU`: Ruleset e.g. "Japanese"
- `KM`: Komi (first-move advantage offset for W) e.g. "6.5"
- `RE`: Result of the game e.g. "B+Resign" or "W+3.5"
- `HA`: Handicap >=2 e.g. 4. Always given to B.

All of the above properties should go at the beginning of the SGF, before any moves. The full list of basic properties
can be found here: https://www.red-bean.com/sgf/properties.html and the go-related properties at
https://www.red-bean.com/sgf/go.html#properties

### Representing in code
For use in-game, it would make sense to store the game info separately from the moves while the game is in progress, and
then when/if an SGF is requested for download/needs to be saved to server, then it can be exported by concatenating the 
two and ensuring grouping is accurate. The client can and should be able to represent the SGF data as an array of string
(one for each line of the SGf file) or a Map of string, or whatever else the client chooses as the best way if it 
chooses, but it should be at all times capable of producing the same state as a consolidated string for the server's
reference and for exporting purposes.