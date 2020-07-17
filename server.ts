import { serve, ServerRequest } from "https://deno.land/std/http/server.ts"

async function serveFile(req: ServerRequest, filePath: string, contentType?: string) {
  const [file, fileInfo] = await Promise.all([Deno.open(filePath), Deno.stat(filePath)]);
  const headers = new Headers();
  headers.set("content-length", fileInfo.size.toString());
  contentType
      ? headers.set("content-type", contentType)
      : headers.set("content-type", "text/html");
  req.respond({
    status: 200,
    body: file,
    headers,
  });
}

async function main(): Promise<void> {
  const server = serve({port: 8000});
  console.log("http://localhost:8000");
  for await (const req of server) {
    try {
      if (req.url === '/') {
        await serveFile(req, "./www/html/index.html");
      } else if (req.url === "/boardtest") {
        await serveFile(req, "./www/html/board_test.html");
      } else if (req.url.match(/\/styles\/.*/)) {
        await serveFile(req, `.${req.url}`, "text/css")
      } else if (req.url.match(/\/modules\/.*/) || req.url.match(/\/scripts\/.*/) || req.url.match(/\/config\/.*/)) {
        await serveFile(req, `.${req.url}`, "text/javascript")
      } else {
          await serveFile(req, `./www/html${req.url}`);
      }
    } catch (NotFound) {
      req.respond({body: "<h1>Not found!</h1>", status: 404});
    }
  }
}

if (import.meta.main) {
  main();
}