import { serve, ServerRequest, Server, listenAndServe } from "https://deno.land/std/http/server.ts";
// TODO: upgrade to listenAndServeTLS for prod only (switch on some kind of config)

async function serveFile(req: ServerRequest, filePath: string) {
  const [file, fileInfo] = await Promise.all([Deno.open(filePath), Deno.stat(filePath)]);
  const headers = new Headers();
  headers.set("content-length",fileInfo.size.toString());
  setMIMEType(req, headers);
  const buf = new Uint8Array(fileInfo.size);
  await file.read(buf);
  console.log("request for ",req.url," completed");
  req.respond({
    status: 200,
    body: buf,
    headers,
  });
}

async function main() {
  const server: Server = serve(":8000");
  console.log("Visit http://localhost:8000/index.html to view the test server");
  for await (const req of server) {
    console.log("Got request for: ",req.url);
    try {
      console.log(JSON.stringify(req.headers));

      await routeRequest(req);
      console.log("request for ",req.url," completed");
    } catch(NotFound) {
      console.error("unable to serve request: ",req.url);
      req.respond({body: "<h1>Not found!</h1>", status: 404}); // TODO: Make a real 404 page, serve statically
    }
  }
  // listenAndServe(":8000",)
  // console.log("Visit http://localhost:8000/ to view the test server");
}

async function routeRequest(req: ServerRequest): Promise<void> {

  // if (!req.url.startsWith("www/")) {
  //   req.respond({body: "<h1>Not found!</h1>", status: 404}); // TODO: Make a real 404 page, serve statically
  // }
  if(req.url === "/" || req.url === "/index.html") {
    return await serveFile(req,"./www/html/index.html");
  }

  // TODO: Handle WebSocket upgrades here
  // if(req.url.endsWith(".ws")) { ... }

  // serve static HTML (only allowed from www/html)
//  if (req.url.endsWith(".html")) {

  // serve all static content under www/
  const matches = /(.*)\.(html|js|css|ico|png|webmanifest)/.test(req.url);
  if (matches) {
    const localPath = `./www${req.url}`;
    Deno.lstatSync(localPath);
    await serveFile(req, localPath);
  } else {
    console.error("unable to serve request: ",req.url);
    req.respond({body: "<h1>Not found!</h1>", status: 404}); // TODO: Make a real 404 page, serve statically
  }

  //   // serve scripts (only allowed from www/scripts)
  // } else if (req.url.endsWith(".js")) {
  //   const matches = /(.*)\.js/.exec(req.url);
  //   if (matches && matches[1]) {
  //     const basePath = matches[1].toString();
  //     console.log(basePath);
  //     const localPath = `./www/${basePath}.js`;
  //     await serveFile(req, localPath);
  //   }
  //
  //   // serve static CSS only
  // } else if (req.url.endsWith(".css")) {
  //   const matches = /(.*)\.css/.exec(req.url);
  //   if (matches && matches[1]) {
  //     const basePath = matches[1].toString();
  //     console.log(basePath);
  //     const localPath = `./www/${basePath}.js`;
  //     await serveFile(req, localPath);
  //   }
  // }
}

function setMIMEType(req: ServerRequest, headers: Headers): void {
  const extension = req.url.slice(req.url.lastIndexOf(".")+1);
  switch(extension.toLowerCase()) {
    case "js":
      console.log("typed a JS MIME lol");
      headers.set("content-type","application/javascript");
      break;
    case "html":
      headers.set("content-type","text/html");
      break;
    case "css":
      headers.set("content-type","text/css");
      break;
    case "png":
      headers.set("content-type","image/png");
      break;
    default:
      headers.set("content-type","text/plain");
  }
}

function setContentLength(req: ServerRequest, headers: Headers): void {

}

function notFoundRequest(req: ServerRequest): void {

}

if (import.meta.main) {
  await main();
}