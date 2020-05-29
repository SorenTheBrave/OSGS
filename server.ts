import { serve, ServerRequest } from "https://deno.land/std/http/server.ts"

async function serveFile(req: ServerRequest, filePath: string) {
  const [file, fileInfo] = await Promise.all([Deno.open(filePath), Deno.stat(filePath)]);
  const headers = new Headers();
  headers.set("content-length",fileInfo.size.toString());
  headers.set("content-type", "text/html");
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
      switch (req.url) {
        // More pages here...
        case "/":
          await serveFile(req, "./www/html/index.html")
          break;
        default:
          await serveFile(req, `./www/html${req.url}`);
          break;
      }
    } catch (NotFound) {
      req.respond({body: "<h1>Not found!</h1>", status: 404});
    }
  }
}

if (import.meta.main) {
  main();
}