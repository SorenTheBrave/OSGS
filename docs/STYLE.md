### Style

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

function populateWidgets(defaultWidgets: Array<Widget>) {
   defaultWidgets.push(createWidget("Example",5));
   defaultWidgets.push(createWidget("lorg boi",200));
   defaultWidgets.push(createWidget("just uno",1));
    
    // do something with defaultWidgets, like UI
}
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

To expand upon this, there are three files in this directory labelled "blob.ts", "imperative.ts" and "oop.ts". Blob is 
as unstructured as it comes - the instructions all follow one another in an unorganized manner. In imperative.ts, sets 
of instructions that follow logical "steps" are grouped into functions. In oop.ts, those functions are wrapped in object
form. Take a look at all three and ask yourself which of the three you prefer the best. This project aims to follow the 
imperative style globally.

##### Deno/Typescript Conventions:

- Prefer functions, interfaces, types, and then classes in that order (try to use only functions & interfaces if possible)
- Functions are your friend. Type checking is your friend. If you have a func with a ton of primitive parameters,
  consider making that collection of primitives an interface or type, and accept that as a single param instead.
- Export all dependencies (anything with a URL in the import statement) in file deps.ts. Reimport from that file where 
  needed.
- Use `await`/`async` instead of `Promise`, in accordance with Deno style.

##### Javascript/Frontend Conventions:

- vanilla JS where possible
- zero libraries if possible, except maybe lodash. lodash is cool.

##### General Formatting/Conventions:

- 2-space indentation (no tabs, use smart tabs or set tab width to 2 spaces project-wide in your editor)
- ES6 style imports, with spaces inside the curly's: `import { Type } from "./source.ts"`