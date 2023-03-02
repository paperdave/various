/** (Insecurely) Generates a random integer between `min` and `max`. */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** (Insecurely) Generates a random float between `min` and `max`. */
export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
