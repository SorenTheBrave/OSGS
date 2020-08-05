# OSGS
An open source Go/Baduk/Weiqi server built with Deno. This means the entire project sits atop one (theoretically)
cross-platform and single-language codebase. Even the frontend code is written in typescript.

Main project goals:

- Be a completely open source Go platform, doubling as a self-hostable server solution and as a professional
 public-facing site
- Work with as few dependencies as possible. Use only reputable dependencies.
- Follow an imperative paradigm (see bottom of this README)
- Align with the Unix philosophy- "Do one thing, and do that one thing well". If you need to build a complicated thing,
  make it out of multiple components built in this same philosophy.
- Be fully WCAG 2.0 compliant in all major versions (Accessible to those with disabilities)
- Promote the spread and enjoyment of Go in whatever ways possible

## What is Go/Baduk/Weiqi?
An ancient board game of Chinese origin, somewhat similar in complexity and difficulty to Chess. The rules are much
simpler than Chess, but paradoxically it can become more computationally complex. The game is played by two opponents 
who command black or white stones. Players take turns placing stones on the intersection of lines etched/painted onto
the board in a square grid. If a stone or clump of adjascent stones is surrounded by stones of the opposite color, they
are captured, and taken off the board as points for the capturing player. When the board is full, the game is won by the
player who has captured more stones and controlled more of the board's territory with their stones.

For a more in-depth look at the rules, etiquette, and strategy I suggest you plg "sensei's library go" into your search
engine of choice. Sensei's Library provides a wide array of resources for those interested in the game.

## Dev setup
The server is ready to go out-of-the-box, but because the frontend code is all
Typecript, it is necessary to compile that code before running the local server, 
otherwise there won't be much for it to serve. The file `build.sh` is a simple
shell script wrapper for the command `deno --allow-run --allow-read --allow-write config/build.ts`
which will compile all `.js` and `.ts` files in that directory to the `www/scripts`
folder. For this reason, all frontend scripts should be written to that directory.

## Starting the server

It should go without saying that Deno must be installed and present on PATH. Then:
`deno run --allow-read --allow-net server.ts` 

will begin the server process. This can aslo be achieved by running the `run.sh` script.
Test out the site by visiting `localhost:8000/index.html`.

## Bundling the frontend code

You can't import typescript in a browser. Because of this, all of the typescript needs to be compiled prior to launching
the server. For the server's uptime, it will serve that one version of the compiled typescript. To do this, a super 
simple shell script is provided (`run.sh`) which can be run on *nix systems natively (Mac included, in theory) and on 
Windows by using git bash. A separate super simple `build.sh` script is also available that will compile the ts but not 
start the server.

## Web standards

All static HTML content should be stored under www/html somewhere. All script files
destined for the frontend should eventually end up in www/scripts somewhere. Subdirectories
are permitted for both of these types of files. Images should fall under www/images. Fonts go
under www/fonts. etc.

When including scripts, exclude the "www" and use relative path, i.e.

```html
<script type="module" src="../scripts/play.js"></script>
```

## Style

Prefer imperative programming over Object-Oriented Programming (OOP). By this I mean, code this:

```typescript
interface Widget {
  size: number,
  name: string
}

function createWidget(name: string, size: number = 5) {
  return {
    name: name,
    size: size
  } as Widget;
}

window.addEventListener("load",() => {
   const defaultWidgets: Array<Widget> = [];
   defaultWidgets.push(createWidget("Example",5));
   defaultWidgets.push(createWidget("lorg boi",200));
   defaultWidgets.push(createWidget("just uno",1));
    
    // do something with defaultWidgets, like UI
});
```

...instead of this:

```typescript
class Widget {
  size: number;
  name: string;
  constructor(name: string, size: number = 5) {
    this.name = name;
    this.size = size;
  }
}

window.addEventListener("load",() => {
   const defaultWidgets: Array<Widget> = [];
   defaultWidgets.push(new Widget("Example",5));
   defaultWidgets.push(new Widget("lorg boi",200));
   defaultWidgets.push(new Widget("just uno",1));
    
    // do something with defaultWidgets, like UI
});
```

Deno/Typescript Conventions:

- Prefer functions, interfaces, types, and then classes in that order (try to use only functions & interfaces if possible)
- Functions are your friend. Type checking is your friend. If you have a func with a ton of primitive parameters,
  consider making that collection of primitives an interface or type and accept that.
- Leverage Typescript type checking for DOM elements, e.g.  `drawStone(board: HTMLCanvasElement)` will never
  accidentally try to make a call `.getContext("2d")` on a <div> element because the TS compiler should add a
  runtime check verifying the prototype of the DOM node. If you type param board as `any`, you discard this benefit.
- Export all dependencies (anything with a URL in the import statement) in file deps.ts. Reimport from that file where 
  needed.
- Use `await`/`async` instead of `Promise`, in accordance with Deno style.

...why? See "Imperative programming" section down below.

Formatting/Conventions:

- 2-space indentation (no tabs, use smart tabs or set tab to 2 spaces project-wide)
- ES6 style imports, with spaces inside the curly's: `import { Type } from "./source.ts"`

#### Imperative programming

This project tries to follow an imperative coding style (as opposed to OOP or strict FP). Refer to doc/STYLE.md for
more information.

#### Contributing

