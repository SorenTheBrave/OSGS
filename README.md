# OSGS
An open source Go/Baduk/Weiqi server built with Deno.

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

will begin the server process. Test out the site by visiting `localhost:8000`.

## Web standards

All static HTML content should be stored under www/html somewhere. All script files
destined for the frontend should eventually end up in www/scripts somewhere. Subdirectories
are permitted for both of these types of files.

When including scripts, exclude the "www" and just start with the following slash, i.e.

```html
<script type="module" src="/scripts/play.js"></script>
```

Your IDE will probably complain about the path, that's fine. Let it complain, for the time being.