import fs from 'node:fs/promises'
import fsSync, { ReadStream, WriteStream } from 'node:fs'
import compressing from 'compressing'
import pump from 'pump'

import { join, relative } from 'node:path'
import { tmpdir } from 'node:os'
import { MRIndex } from './mrindex'

export type Override = {
    file: string | Buffer | ReadStream;
    path: string;
};

export class MRPack {

    private tmp_dir: string;
    public mrpack?: MRIndex;
    public overrides: Override[];

    constructor(tmp_dir: string) {
        this.tmp_dir = tmp_dir;
        this.overrides = [];
    }

    async unpack(file: compressing.sourceType) {
        await compressing.zip.uncompress(file, this.tmp_dir);
        let indexFile = await fs.readFile(join(this.tmp_dir, 'modrinth.index.json'), { encoding: 'utf8' });
        this.mrpack = JSON.parse(indexFile);
        this.overrides.push({
            file: join(this.tmp_dir, 'overrides'),
            path: ''
        });
    }

    async pack(destStream: WriteStream) {
        let zipStream = new compressing.zip.Stream();


        zipStream.on('error', console.error);

        zipStream.addEntry(
            Buffer.from(JSON.stringify(this.mrpack)), {
                relativePath: 'modrinth.index.json'
        });

        // add all "override" items
        this.overrides.forEach((override: Override) => {
            // bug workaround:
            // when using addEntry with a file path (string) instead of a Buffer or Stream, the file / directory doesnt end up in the created zip file.
            if(isString(override.file)) {
                let filePath = override.file as string;
                if(fsSync.existsSync(filePath) && fsSync.statSync(filePath).isDirectory()) {
                    let allFiles = readDirectoryRecursivly(filePath);

                    allFiles.forEach((element: string) => {
                        zipStream.addEntry(fsSync.createReadStream(element), {
                            ignoreBase: true,
                            relativePath: join('overrides', override.path, relative(filePath, element)) });
                    });

                    return;
                } else {
                    override.file = fsSync.createReadStream(filePath);
                }
            }

            zipStream.addEntry(override.file as any, {
                ignoreBase: true,
                relativePath: join('overrides', override.path) });
        });

        // pump dependency can probably be removed, just use .pipe instead and listen for error
        pump(zipStream, destStream, (error) => {
            if(error) console.error(error);
        });
    }

    cleanupSync() {
        fsSync.rmSync(this.tmp_dir, { recursive: true, force: true });
    }

    cleanup() {
        return fs.rm(this.tmp_dir, { recursive: true, force: true });
    }

}

function isString(value: any): value is string {
    return typeof value === 'string';
}

function readDirectoryRecursivly(dirPath: string, arrayOfFiles: string[] = [], listDirectories = false) {
    let files = fsSync.readdirSync(dirPath);
  
    files.forEach(function(file) {
      if (fsSync.statSync(dirPath + "/" + file).isDirectory()) {
        if(listDirectories) {
            arrayOfFiles.push(join(dirPath, "/", file));
        }
        arrayOfFiles = readDirectoryRecursivly(dirPath + "/" + file, arrayOfFiles, listDirectories);
      } else {
        arrayOfFiles.push(join(dirPath, "/", file));
      }
    });
  
    return arrayOfFiles;
}

export async function initPack(): Promise<MRPack> {
    let tmp_dir = await fs.mkdtemp(join(tmpdir(), 'mrpack-'));

    return new MRPack(tmp_dir);
}