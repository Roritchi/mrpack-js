# mrpack-js

Utility to parse and edit .mrpack (Modrinth Modpack) Files

# Usage

This utility can be used to, for example, merge two modpacks together or dynamically generate your modpacks.

# Examples
```js
import * as mr from 'mrpack-js'
import { Client } from "mrpack-js/mrindex";
import fs from 'node:fs/promises'

let pack = await mr.initPack();
let packFile = await fs.readFile("./test.mrpack");

await pack.unpack(packFile);

// TODO: Make your changes
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
    file: "",
    path: ""
});
// END: Changes

let outFile = fsSync.createWriteStream("./output.mrpack");

await pack.pack(outFile);
await pack.cleanup();

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
