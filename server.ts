import { serve, ServerRequest, Server, listenAndServe, acceptWebSocket, WebSocket } from "./deps.ts";
import { OSGSSockEvent, routeSocketEvent } from "./mods/sockets.ts";

// TODO: upgrade to listenAndServeTLS for prod only (switch on some kind of config)

/**
 * Just the basics of web request handling. Any complicated logic should go in a separate file. This module is just for
 * high-level orchestration of the backend component of the server.
 */


// Main server loop
async function main() {
  const server: Server = serve(":8000");
  console.log("Visit http://localhost:8000/index.html to view the test server");
  for await (const req of server) {
    console.log("Got request for: ", req.url);
    await routeRequest(req);
  }
}

async function routeRequest(req: ServerRequest): Promise<void> {
  
  if (req.url === "/" || req.url === "/index.html") {
    return await serveFile(req, "./www/index.html");
  }
  
  if (req.url.endsWith(".ws")) {
    const {conn, r: bufReader, w: bufWriter, headers} = req;
    acceptWebSocket({
      conn,
      bufReader,
      bufWriter,
      headers
    })
      .then(handleWS)
      .catch(async (e) => {
        console.error(`failed to accept websocket: ${e}`);
        await req.respond({status: 400});
      });
  }
  
  const matches = /(.*)\.(html|js|css|png|svg)/.test(req.url);
  const isFaviconRequest = /(.*)(\.ico|(16|32|192|512)\.png|\.webmanifest)/.test(req.url);
  try{
    if(isFaviconRequest) {
      const localPath = `./www${req.url}`;
      Deno.lstatSync(localPath);
      await serveFile(req, localPath);
    } else if (matches) {
      const localPath = `./www${req.url}`;
      Deno.lstatSync(localPath);
      await serveFile(req, localPath);
    } else {
      await notFoundRequest(req);
    }
  } catch (e) {
    console.error(e);
    await notFoundRequest(req);
  }
}

async function serveFile(req: ServerRequest, filePath: string, contentType?: string) {
  const [file, fileInfo] = await Promise.all([Deno.open(filePath), Deno.stat(filePath)]);
  const headers = new Headers();
  headers.set("content-length", fileInfo.size.toString());
  setMIMEType(req, headers);
  const buf = new Uint8Array(fileInfo.size);
  await file.read(buf);
  req.respond({
    status: 200,
    body: buf,
    headers,
  });
}

function setMIMEType(req: ServerRequest, headers: Headers): void {
  const extension = req.url.slice(req.url.lastIndexOf(".") + 1);
  console.log(`extension for ${req.url}: ${extension}`);
  switch (extension.toLowerCase()) {
    case "js":
      headers.set("content-type", "application/javascript");
      break;
    case "htm":
    case "html":
      headers.set("content-type", "text/html");
      break;
    case "css":
      headers.set("content-type", "text/css");
      break;
    case "png":
      headers.set("content-type", "image/png");
      break;
    case "manifest":
      headers.set("content-type", "application/manifest+json")
      break;
    case "ico":
      headers.set("content-type", "image/x-icon")
      break;
    default:
      headers.set("content-type", "text/plain");
  }
}

async function handleWS(sock: WebSocket): Promise<void> {
  console.log(`sock opened!`);
  try {
    for await (const ev of sock) {
      if (typeof ev === "string") {
        const message: OSGSSockEvent = JSON.parse(ev) as OSGSSockEvent;
        routeSocketEvent(message);
      } else {
        throw "WS request was not a string-encoded object!";
      }
    }
  } catch (e) {
    console.error(`failed to handle ws message: ${e}`);
    
    if (!sock.isClosed) {
      await sock.close(1000).catch(console.error);
    }
  }
}

function setContentLength(req: ServerRequest, headers: Headers): void {

}

function notFoundRequest(req: ServerRequest): Promise<void> {
  console.error("Generated 404 for request: ", req.url);
  return req.respond({body: "<h1>Not found!</h1>", status: 404}); // TODO: Make a real 404 page, serve statically
}

if (import.meta.main) {
  await main();
}