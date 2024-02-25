# mrpack-js

Utility to parse and edit .mrpack (Modrinth Modpack) Files

# Usage

This utility can be used to, for example, merge two modpacks together or dynamically generate your modpacks.

# Examples

Typescript should tell you what types you can use

```ts
import * as mr from 'mrpack-js'
import { Client } from "mrpack-js/mrindex";
import fs from 'node:fs/promises'

let pack = await mr.initPack();
let packFile = await fs.readFile("./test.mrpack");

await pack.unpack(packFile);

// TODO: Make your changes

console.log(pack.mrpack); // look at a modpack json to understand how this works

pack.mrpack?.files.push({
    path: "mods/test.jar",
    hashes: {
        "sha1": "xxx"
    },
    env: {
        "client": Client.Optional,
        "server": Client.Required
    },
    downloads: [],
    fileSize: 0
});

pack.overrides.push({
    file: "", // string = file path | Buffer = file contents | ReadStream = file contents;
    path: "" // path in modpack
});
// END: Changes

let outFile = fsSync.createWriteStream("./output.mrpack");

await pack.pack(outFile);
await pack.cleanup();
```

# Types
```ts

export type Override = {
    file: string | Buffer | ReadStream;
    path: string;
};

export class MRPack {

    private tmp_dir: string;
    public mrpack?: MRIndex;
    public overrides: Override[];

    async pack(destStream: WriteStream);
    async unpack(file: compressing.sourceType);

    cleanup();
    cleanupSync();

}

export interface MRIndex {
    game:          string;
    formatVersion: number;
    versionId:     string;
    name:          string;
    summary:       null;
    files:         File[];
    dependencies:  object;
}

export interface File {
    path:      string;
    hashes:    object;
    env:       Env;
    downloads: string[];
    fileSize:  number;
}

export interface Env {
    server: Client;
    client: Client;
}

export enum Client {
    Optional = "optional",
    Required = "required",
}

```

# Install
To install dependencies:

(also works with npm, pnpm, yarn, etc...)

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.0.0. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
