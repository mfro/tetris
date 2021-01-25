import alea from 'alea';
import { shallowReactive } from 'vue';

import { on } from '@mfro/ts-common/events';
import { Packet, receive, send } from '@mfro/ts-common/sockets/client';
import { RoomCode } from '@mfro/tetris-common';

import { empty_state, Game, new_game, play, reactive_state } from './tetris';

import { GameRules, UserPreferences } from './tetris/config';

const Join = Packet.define();

const StartGame = Packet.define<number>();
const Hold = Packet.define();
const Drop = Packet.define<number>();
const Shift = Packet.define<1 | -1>();
const Rotate = Packet.define<1 | -1>();
const LockDown = Packet.define();
const NewFalling = Packet.define();
const EndGame = Packet.define();

interface RemoteState {
  local: Game | null;
  remote: Game | null;

  code: string | null;
  state: number;

  reset: () => void;
}

function observe<Args extends any[], R, O extends { [k in K]: (...args: Args) => R }, K extends keyof O>(target: O, key: K, hook: (...args: Args) => R) {
  let original = target[key];
  target[key] = ((...args) => {
    hook(...args);
    return original(...args);
  }) as O[K];
}

export function remote_game(rules: GameRules, user: UserPreferences) {
  let socket: WebSocket;
  const base =
    window.location.host == 'box:8080' || window.location.host == 'localhost:8080'
      ? 'ws://box:8081/' : 'wss://api.mfro.me/chess/play';

  const state: RemoteState = shallowReactive({
    local: null,
    remote: null,

    code: null,
    state: 0,

    reset() {
      let seed = alea(Math.random()).uint32();
      send(socket, StartGame, seed);
      start_game(seed);
    },
  });

  let cleanup: (() => void) | null = null;
  function start_game(seed: number) {
    cleanup?.();

    let s = reactive_state(empty_state(rules, seed))
    state.local = new_game(rules, s);

    s = reactive_state(empty_state(rules, seed))
    state.remote = new_game(rules, s);

    observe(state.local, 'hold', () => send(socket, Hold));
    observe(state.local, 'drop', (distance) => send(socket, Drop, distance));
    observe(state.local, 'shift', (dir) => send(socket, Shift, dir));
    observe(state.local, 'rotate', (dir) => send(socket, Rotate, dir));
    observe(state.local, 'lock_down', () => send(socket, LockDown));
    observe(state.local, 'new_falling', () => send(socket, NewFalling));
    observe(state.local, 'end_game', () => send(socket, EndGame));

    cleanup = play(user, state.local);
  }

  const url = new URL(window.location.href);
  state.code = url.searchParams.get('code');

  if (state.code) {
    socket = new WebSocket(`${base}?code=${state.code}`);
  } else {
    socket = new WebSocket(`${base}`);
  }

  on(receive(socket, StartGame), seed => {
    state.state = 2;
    start_game(seed);
  });

  on(receive(socket, Hold), () => state.remote!.hold());
  on(receive(socket, Drop), (distance) => state.remote!.drop(distance));
  on(receive(socket, Shift), (dir) => state.remote!.shift(dir));
  on(receive(socket, Rotate), (dir) => state.remote!.rotate(dir));
  on(receive(socket, LockDown), () => state.remote!.lock_down());
  on(receive(socket, NewFalling), () => state.remote!.new_falling());
  on(receive(socket, EndGame), () => state.remote!.end_game());

  on(receive(socket, RoomCode), code => {
    if (code != state.code) {
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      window.history.replaceState(null, document.title, url.pathname + url.search);
    }

    state.code = code;
    state.state = 1;
  });

  on(receive(socket, Join), () => {
    const url = new URL(window.location.href);
    url.searchParams.set('code', state.code!);
    window.history.replaceState(null, document.title, url.pathname + url.search);

    state.state = 2;
    state.reset();
  });

  socket.onopen = () => {
    send(socket, Join);
  };

  return state;
}
