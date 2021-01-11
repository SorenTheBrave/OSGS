# OSGS
An open source Go/Baduk/Weiqi server built with Deno.

Main project goals:

- Be a completely open source Go platform, doubling as a self-hostable server solution and as a professional
 public-facing site
- Work with as few dependencies as possible. Use only reputable dependencies.
- Follow an imperative paradigm (see docs/STYLE.md)
- Align with the Unix philosophy- "Do one thing, and do it well". If you need to build a complicated thing,
  make it out of multiple components built in this same philosophy.
- Be fully WCAG 2.0 compliant in all major versions (Accessible to those with disabilities)
- Promote the spread and enjoyment of Go

## What is Go/Baduk/Weiqi?
An ancient board game of Chinese origin, somewhat similar in complexity and difficulty to Chess. The rules are much
simpler than Chess, but it can become more computationally complex, especially on a standard 19x19 board. The game is played by two opponents 
who command black or white stones. Players take turns placing stones on the intersection of lines etched/painted onto
the board in a square grid. If a stone or collection of adjascent stones (group) is surrounded by stones of the opposite color, they
become captured by the opponent, and removed from the board. When the entire board is full, the game is scored and the
player who has captured more stones and controlled more of the board's territory with their stones is declared the winner.

For a more in-depth look at the rules, etiquette, and strategy I suggest you plug "sensei's library go" into your search
engine of choice. Sensei's Library provides a wide array of resources for those interested in the game.

## Dev setup
The server is ready to go out-of-the-box for now while in early development. Concatenation/minification/uglification will come later. 
For now, all scripts are served via direct path, and this will have to change at some point. Any 
prospective build process should be written as a native Deno script. For now, the following section is all that is required to test the server.

## Starting the server

Deno must be installed and present on PATH. Then:
`deno run --allow-read --allow-net server.ts` 

will begin the server process. This can aslo be achieved by running the `run.sh` script.
Test out the site by visiting `localhost:8000/index.html`.

## Web standards

All static HTML content should be stored under www/html directory. All script files destined for the frontend should
eventually end up in `www/scripts`, but their source should all live in `scripts/` or `mods/` . Subdirectories
are permitted for both of these types of files. Images should fall under www/images. Fonts go
under `www/fonts`. etc.

When including scripts, exclude the "www" and use relative path, i.e.

```html
<script type="module" src="../scripts/play.js"></script>
```
this import is appropriate for a source file that lives in `OSGS/www/scripts/play.js`.

#### Imperative programming

This project tries to follow an imperative coding style (as opposed to OOP or strict FP). Refer to `doc/STYLE.md` for
more information.

#### Contributing

Yes. (PRs welcome)
