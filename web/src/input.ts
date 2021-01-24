export const
  SPACE = 32,
  ENTER = 13,
  LEFT = 37,
  UP = 38,
  SHIFT = 16,
  DOWN = 40,
  RIGHT = 39,
  A = 65,
  Z = 90,
  S = 83,
  X = 88,
  C = 67,
  R = 82;

let down = new Set<number>();

let up_listeners = new Map<number, (() => void)[]>();
let down_listeners = new Map<number, (() => void)[]>();

window.addEventListener('keydown', e => {
  if (down.has(e.keyCode))
    return;

  // console.log(e.keyCode);
  down.add(e.keyCode);

  let list = down_listeners.get(e.keyCode);
  if (!list) return;

  for (let item of list) {
    item();
  }
});

window.addEventListener('keyup', e => {
  down.delete(e.keyCode);

  let list = up_listeners.get(e.keyCode);
  if (!list) return;

  for (let item of list) {
    item();
  }
});

export function isKeyDown(k: number) {
  return down.has(k);
}

export function onKeyDown(key: number, handler: () => void) {
  let list = down_listeners.get(key);
  if (!list) down_listeners.set(key, list = []);
  list.push(handler);
}

export function onKeyUp(key: number, handler: () => void) {
  let list = up_listeners.get(key);
  if (!list) up_listeners.set(key, list = []);
  list.push(handler);
}
