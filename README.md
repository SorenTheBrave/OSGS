# OSGS
An open source Go/Baduk/Weiqi server built with Deno. This means the entire project sits atop one (theoretically)
cross-platform and single-language codebase. Even the frontend code is written in typescript.

Main project goals:

- Be a completely open source Go platform, doubling as a self-hostable server solution and as a professional
 public-facing site
- Work with as few dependencies as possible. Use only reputable dependencies.
- Follow an imperative paradigm (see bottom of this README)
- Align with the Unix philosophy- "Do one thing, and do that one thing well"
- Be fully WCAG 2.0 compliant in all major versions (Accessible to those with disabilities)
- Promote the spread and enjoyment of Go in whatever ways possible

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
simple shell script is provided (`run.sh`) which can be run on *nix systems natively (Mac included) and on Windows
by using git bash. A separate super simple `build.sh` script is also available that will compile the ts but not start the
server.

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

- Prefer interfaces, types, and then classes in that order (try to use only interfaces if possible)
- Functions are your friend. Type checking is your friend. If you have a func with a ton of primitive parameters,
  consider making that collection of primitives an interface or type and accept that.
- Leverage Typescript type checking for DOM elements, e.g.  `drawStone(board: HTMLCanvasElement)` will never
  accidentally try to make a call `.getContext("2d")` on a <div> element because the TS compiler should add a
  runtime check verifying the prototype of the DOM node. If you type param board as `any`, you discard this benefit

...why? See "Imperative programming" section down below.

Formatting/Conventions:

- 2-space indentation
- ES6 style imports, with spaces inside the curly's: `import { Type } from "./source.ts"`
- `await`/`async` instead of `Promise`, in accordance with Deno style

#### Imperative programming

Why ditch OOP? Mostly because imho it usually creates unnecessary waste and tends to obscure the actual
intent behind the "business logic" code. Consider the following three pseudo-code snippets:

```typescript
// EX 1: just the necessary instructions in order, sometimes repeated as necessary (as simple as possible)
interface Complex {
  real: number,
  imaginary: number
}

const mainBlob = function() {
  const threePlusTwoi: Complex = {real: 3, imaginary: 2};
  const fourMinusThreei: Complex = {real: 4, imaginary: -3};
  const onePlusFivei: Complex = {real: 1, imaginary: 5};

  const added = {
    real: threePlusTwoi.real + onePlusFivei.real,
    imaginary: threePlusTwoi.imaginary + onePlusFivei.imaginary,
  } as Complex;

  const multiplied = {
    real: fourMinusThreei.real * threePlusTwoi.real,
    imaginary: fourMinusThreei.imaginary * threePlusTwoi.imaginary,
  } as Complex;

  const addedString = `${added.real.toString()} ${added.imaginary >= 0 ? '+' : '-'} ${added.imaginary.toString()}i`;
  const multipliedString = `${multiplied.real.toString()} ${multiplied.imaginary >= 0 ? '+' : '-'} ${multiplied.imaginary.toString()}i`;

  console.log("(3 + 2i) + (1 + 5i) = ",addedString);
  console.log("(4 - 3i) * (3 + 2i) = ",multipliedString);
}();
```

```typescript
// EX 2: Imperative - instructions in order, but logically grouped into functions that modify provided state
interface Complex {
  real: number,
  imaginary: number
}

function add(a: Complex, b: Complex) {
  return {
    real: a.real + b.real,
    imaginary: a.imaginary + b.imaginary
  } as Complex;
}

function mul(a: Complex, b: Complex) {
  return {
    real: a.real * b.real,
    imaginary: a.imaginary * b.imaginary
  } as Complex;
}

function printComplex(c: Complex): string {
  return `${c.real.toString()} ${c.imaginary >= 0 ? '+' : '-'} ${c.imaginary.toString()}i`;
}

const mainImperative = function() {
  const threePlusTwoi: Complex = {real: 3, imaginary: 2};
  const fourMinusThreei: Complex = {real: 4, imaginary: -3};
  const onePlusFivei: Complex = {real: 1, imaginary: 5};

  console.log("(3 + 2i) + (1 + 5i) = ",printComplex(add(threePlusTwoi,onePlusFivei)));
  console.log("(4 - 3i) * (3 + 2i) = ",printComplex(mul(fourMinusThreei,threePlusTwoi)));
}();
```

```typescript
// EX 3: OOP - instructions encased in objects which represent some internal state, and expose restricted access to it
class Complex {
  real: number;
  imaginary: number;
  constructor(real: number, imaginary: number) {
    this.real = real;
    this.imaginary = imaginary;
  }
  
  add(other: Complex): Complex {
    return new Complex(
      this.real + other.real,
      this.imaginary + other.imaginary);
  }
  
  mul(other: Complex): Complex {
    return new Complex(
      this.real * other.real,
      this.imaginary * other.imaginary);
  }
  
  print(): string {
    return `${this.real.toString()} ${this.imaginary >= 0 ? '+' : '-'} ${this.imaginary.toString()}i`
  }
}

const mainOOP = function() {
  const threePlusTwoi: Complex = new Complex(3,2);
  const fourMinusThreei: Complex = new Complex(4, -3);
  const onePlusFivei: Complex = new Complex(1, 5);

  const added: Complex = threePlusTwoi.add(onePlusFivei);
  const multiplied: Complex = fourMinusThreei.mul(threePlusTwoi);

  console.log("(3 + 2i) + (1 + 5i) = ",added.print());
  console.log("(4 - 3i) * (3 + 2i) = ",multiplied.print());
}();
```

They all produce exactly the same output. But now go back and really re-read the main functions of each
example. Now which is best? Which is really the most clear in its intention? Which is the least wasteful?

I'd argue the imperative wins on all counts- there's something just lovely about the it- the actual work is done w/
just function calls acting on the original instances. In this example, we simply define exactly the data we want to
work on (realistically, the DB or page would provide us this data) and then a function just modifies things as
it sees necessary. No additional variables are required (ala `added` or `multipled`). The intent is also crystal
clear: 

`printComplex(add(threePlusTwoi,onePlusFivei)))`  => "Print me the addition of 3+2i and 1+5i"

w/ OOP you need to come up with a meaningful name for your intermediary variable. And then, it may stick
around for a long time in memory beyond your control. It's up to the VM when your "added" variable will be 
garbage collected. Contrast that with a function call, which the interpreter knows exactly how many bytes
of memory to allocate and then immediately reclaim, and it just seems wasteful.

On the other extreme, the big blob-o-code is actually the fewest lines, but they're the most unreadable, and
even though the total line count is low, there is some repetition. And even worse, none of the code is reusable
anywhere else. Plus, since converting the intermediary is no longer encapsulated in a function or method, we end
up creating a second intermediary, otherwise it would just become super unreadable. Yuck! Hopefully you found it
detestable for these reasons.


##### Imperative Code - The bottom line

No matter which code snippet you liked, there's still one bigger underlying reason to choose imperative style. 
*Separation of form(state) from function*.

- If you _encapsulate_ your data in a class, you'll inevitable end up writing methods just to get that data back out.
- If you write abstract classes eventually you'll end up making one of them with only one implementation. In that case,
why not just have one concrete class?
- If you plan your wedding before you've even met your partner, won't you have probably wasted your time?

_Don't write code because you might need some of it later. Write only the code you know you need right now.
Then try and delete half of it and make it still work._

...and make it readable. None of that blob-o-code shit.