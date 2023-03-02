/** Clamps a number to a min and max value. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function lerpClamped(a: number, b: number, t: number): number {
  return lerp(a, b, clamp(t, 0, 1));
}

export function step(value: number, target: number, increment: number): number {
  return value < target ? Math.min(value + increment, target) : Math.max(value - increment, target);
}
