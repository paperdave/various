export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function deferred<T>(): [Promise<T>, (x: T) => void, (err: any) => void] {
  let resolve!: (x: T) => void;
  let reject!: (err: any) => void;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return [promise, resolve, reject];
}
