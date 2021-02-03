import { emit, Event, off, on } from "@mfro/ts-common/events";

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

let holding = new Set<number>();

let press = new Map<number, Event>();
let release = new Map<number, Event>();

window.addEventListener('keydown', e => {
  if (holding.has(e.keyCode))
    return;

  // console.log(e.keyCode);
  holding.add(e.keyCode);

  let event = press.get(e.keyCode);
  if (event) emit(event);
});

window.addEventListener('keyup', e => {
  holding.delete(e.keyCode);

  let event = release.get(e.keyCode);
  if (event) emit(event);
});

export function isKeyDown(k: number) {
  return holding.has(k);
}

export function onKeyDown(key: number, handler: () => void) {
  let event = press.get(key);
  if (!event) press.set(key, event = Event());

  on(event, handler);
  return () => off(event!, handler);
}

export function onKeyUp(key: number, handler: () => void) {
  let event = release.get(key);
  if (!event) release.set(key, event = Event());

  on(event, handler);
  return () => off(event!, handler);
}
