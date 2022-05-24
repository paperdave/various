export declare function delay(ms: number): Promise<unknown>;
export declare function deferred<T>(): [
    Promise<T>,
    (x: T) => void,
    (err: any) => void
];
