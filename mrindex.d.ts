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
