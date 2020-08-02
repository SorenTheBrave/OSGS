### A NOTE ON TYPESCRIPT AND DOM TYPES

(Note: Please don't commit anything besides this file to the defs folder. This would be wasteful. Thanks! -Alex )

#### IDE hinting: it can be annoying 

For whatever reason, in my IDE (Atlassian Webstorm) it refuses to acknowledge the built-in types provided
to the Typescript compiler when compiling with default options, producing the obnoxious undeserved red-squiggly-lines of
doom. This makes it pretty obnoxious to edit files with code like this:

```typescript
function createBoard(container: HTMLDivElement): HTMLCanvasElement {
    const newBoard = document.createElement("canvas");
    newBoard.classList.add("board");
    container.appendChild(newBoard);
    return newBoard;
}
```

...where all of the tokens ["HTMLDivElement", "HTMLCanvasElement", "document"] produce tsc errors such as "TSC 2304: 
unable to find name 'document'". Phooey.

#### Failed solutions that _should_ work

I'd tried such things as adding `--target "ES6"` or `--lib "DOM"` to the global Typescript compilerOptions to get things 
to take, but it seems the "intellisense" isn't so... intelli-anything... in this case... yeah.

(On a serious note, if anyone discovers why this _doesn't_ work, please share why, so we can replace this README with 
your explanation!)

#### Begrudgingly solving the issue

To rectify this, I found that including the *.d.ts definitions somewhere inside the project directory meant that the IDE
auto-linting suddenly "realized" what a 'document' and an 'HTMLElement' are all of a sudden. So, you can place those 
definitions in this folder too, and things should resolve.

If you install from the net, you'll know where your Typescript is saved, and under the main typescript dir there will be
a subdirectory "/lib" with the .d.ts files you need. Copy "lib.dom.d.ts", "lib.d.ts", and all of the "lib.es2015.*.d.ts"
to this /defs folder to regain sanity.

#### Setup on *nix, installing TS from package manager

I installed my local (Node.js flavored) Typescript via package manager, a-la 
`sudo apt install node-typescript node-typescript-types`, and my type definitions ended up under
`/usr/lib/nodejs/typescript/lib/` directory. So, simple as running the folowing:

```
cp /usr/lib/nodejs/typescript/lib/lib.dom.d.ts .
cp /usr/lib/nodejs/typescript/lib/lib.d.ts .
cp /usr/lib/nodejs/typescript/lib/lib.es2015.** .
```

at a prompt in the /defs folder in the project to shut my IDE up.

Alternatively, you could try Vim! I hear it has excellent Deno language support!