// src/math.ts
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// src/promise.ts
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return [promise, resolve, reject];
}
export {
  clamp,
  deferred,
  delay
};
//# sourceMappingURL=index.js.map
