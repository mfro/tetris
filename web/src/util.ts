export function assert(condition: boolean, message: string): asserts condition {
  if (!condition) {
    debugger;
    throw new Error(message);
  }
}

export function zip<T1, T2>(a: T1[], b: T2[]): [T1, T2][] {
  if (a.length != b.length)
    throw new Error('invalid zip');

  return a.map((v, i) => [v, b[i]]);
}
