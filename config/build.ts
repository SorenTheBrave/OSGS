console.log(`Scanning ${Deno.cwd()}/scripts folder for files...`);
const scriptFiles = Deno.readDirSync(`${Deno.cwd()}/scripts`);
const scriptPaths = resolveScripts(`${Deno.cwd()}/scripts`,scriptFiles);
let failures = 0;
const failedCompilations: string[] = [];

function resolveScripts(basePath: string, inputFiles: Iterable<Deno.DirEntry>): string[] {
    const files = [];
    const dirs = [];

    for (const file of inputFiles) {
        if(file.isFile && /.*\.[t|j]s$/.test(file.name)) {
            files.push(`${basePath}/${file.name}`)
        } else if(file.isDirectory){
            dirs.push(file);
        }
    }

    // start at each directory in scripts/ and recursively resolve file paths
    for (const dir of dirs) {
        const newFiles = resolveDir(`${basePath}/${dir.name}`);
        for(const newFile of newFiles) {
            files.push(newFile);
        }
    }

    return files;
}

function resolveDir(path: string): string[] {
    const localEntries = Deno.readDirSync(path);
    const localFiles = [];
    const localDirs = [];

    for (const file of localEntries) {
        if(file.isFile && /.*\.[t|j]s$/.test(file.name)) {
            localFiles.push(`${path}/${file.name}`)
        } else if(file.isDirectory){
            localDirs.push(file);
        }
    }

    for (const dir of localDirs) {
        const newFiles = resolveDir(`${path}/${dir.name}`);
        for(const newFile of newFiles) {
            localFiles.push(newFile);
        }
    }

    return localFiles;
}

const validScriptPaths = scriptPaths.filter(it => it.endsWith(".js") || it.endsWith(".ts"));
for (const file of validScriptPaths) {
    const fileSuffix = file.slice(file.lastIndexOf('/')+1);
    const filename = fileSuffix.substring(0,fileSuffix.lastIndexOf("."));
    const [diagnostics, emit] = await Deno.bundle(`scripts/${filename}.ts`,undefined,{
        lib: ["dom"],
        allowJs: true
    });
    if(diagnostics == null && emit) {
        Deno.writeTextFileSync(`www/scripts/${filename}.js`,emit);
        console.log(`${file} compiled to www/scripts/${filename}.js` );
    } else {
        console.error("Failed to compile",file,"!");
        console.error(diagnostics);
        failedCompilations.push(file);
        failures++;
    }
}

if (failures > 0) {
    console.error("\n\n-------------------\n   BUILD FAILED\n-------------------");
    console.warn(
        "The build failed because the following files failed to compile!: [",
        failedCompilations.join(', '),
        "]");
    Deno.exit(1);
} else {
    console.log("\n\n-------------------\n   BUILD SUCCESS\n-------------------");
    Deno.exit(0);
}