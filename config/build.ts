let getScriptFilesRecursive = undefined;
let code = 0;

switch(Deno.build.os){
    case "linux":
    case "darwin": // I haven't tested this on darwin arch but... it's unix-like, so... it'll work ...right? .....right?

        // read all .ts files recursively down the scripts/ directory
        getScriptFilesRecursive = Deno.run({
            cmd: ["sh", "-c", "find scripts/* | grep .ts$"],
            stdout: "piped"
        });
        break;
    case "windows":

        // read all .ts files recursively down the scripts/ directory
        getScriptFilesRecursive = Deno.run({
            cmd: ["dir", "scripts\\*.ts", "/b"],
            stdout: "piped"
        });
        const fileStat = await getScriptFilesRecursive.status();
        code = fileStat.code;
        break;
}
if(!!!getScriptFilesRecursive) { console.error("Something hecked up!!"); Deno.exit(1); }
const fileStat = await getScriptFilesRecursive.status();
code = fileStat.code;

if(code === 0) {
    const filesRaw = await getScriptFilesRecursive.output();
    const files: string[] = new TextDecoder().decode(filesRaw).split("\n");
    console.log(files.join(":"));
    for(const file of files) {
        if(file === "") break;
        const fileSuffix = file.slice(file.lastIndexOf('/')+1);
        const filename = fileSuffix.substring(0,fileSuffix.lastIndexOf("."));
        const buildProcess = Deno.run({
            cmd: ["deno", "bundle", file, `www/scripts/${filename}.js`]
        });
        const result = await buildProcess.status();
        if(result.success) {
            console.log(`${file} compiled to www/scripts/${filename}.js` );
        } else {
            console.error("Failed to compile",file,"!");
        }
    }
    console.log("\n\n-----------------\n   BUILD SUCCESS\n-----------------");
    Deno.exit(0);

} else { // Failed to stat scripts/ for .ts files...
    const rawError = await getScriptFilesRecursive.stderrOutput();
    const errorString = new TextDecoder().decode(rawError);
    console.log("Unable to list files! (Did you run with --allow-run and --allow-read ?): ",errorString);
    Deno.exit(code);
}