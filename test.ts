import * as mr from ".";
import fs from 'node:fs/promises'
import fsSync from 'node:fs'

let pack = await mr.initPack();
let packFile = await fs.readFile("./test.mrpack");

await pack.unpack(packFile);

console.log(pack);

let outFile = fsSync.createWriteStream("./output.mrpack");

await pack.pack(outFile);

await pack.cleanup();

console.log('cleaned up', pack.tmp_dir);