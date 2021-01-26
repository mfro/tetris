import alea from 'alea';
import { shallowReactive } from 'vue';

import { on } from '@mfro/ts-common/events';
import { receive, send } from '@mfro/ts-common/sockets/client';
import { BroadcastUpdate, ClientUpdate, RoomCode, RoomState, StartGame, StartGameRequest } from 'common';

import { empty_state, Game, new_game, play, reactive_state } from '.';
import { GameRules, UserPreferences } from './config';

interface Member {
  name: string;
  game: Game | null;
}

interface RemoteState {
  code: string | null;

  local: Game | null;
  index: number;
  members: Member[];

  start_game(rules: GameRules): void;
}

function observe<Args extends any[], R, O extends { [k in K]: (...args: Args) => R }, K extends keyof O>(target: O, key: K, hook: (...args: Args) => R) {
  let original = target[key];
  target[key] = ((...args) => {
    let result = original(...args);
    hook(...args);
    return result;
  }) as O[K];
}

export function create_room(name: string, user: UserPreferences, code: string | null) {
  let socket: WebSocket;
  const base =
    window.location.host == 'box:8080' || window.location.host == 'localhost:8080'
      ? 'ws://box:8081/' : 'wss://api.mfro.me/tetris/play';

  const state: RemoteState = shallowReactive({
    local: null,
    index: 0,
    members: [],

    code: code,
    state: 0,

    start_game(rules: GameRules) {
      let seed = alea(Math.random()).uint32();
      send(socket, StartGameRequest, { seed, rules: GameRules.save(rules) });
    },
  });

  if (state.code) {
    socket = new WebSocket(`${base}?name=${name}&code=${state.code}`);
  } else {
    socket = new WebSocket(`${base}?name=${name}`);
  }

  function check_exit() {
    if (state.members.every((m, i) => !m.game || m.game.state.dead)) {
      state.local = null;
      for (let member of state.members) {
        member.game = null;
      }
    }
  }

  let cleanup: (() => void) | null = null;
  on(receive(socket, StartGame), (config) => {
    cleanup?.();

    let rules = GameRules.load(config.rules);

    let s = reactive_state(empty_state(rules, config.seed))
    state.local = new_game(rules, s);

    for (let i = 0; i < config.players; ++i) {
      if (i == state.index) {
        state.members[i].game = state.local;
      } else {
        let s = reactive_state(empty_state(rules, config.seed))
        state.members[i].game = new_game(rules, s);
      }
    }

    observe(state.local, 'hold', () => send(socket, ClientUpdate, { type: 'hold' }));
    observe(state.local, 'drop', (distance) => send(socket, ClientUpdate, { type: 'drop', distance }));
    observe(state.local, 'shift', (dir) => send(socket, ClientUpdate, { type: 'shift', dir }));
    observe(state.local, 'rotate', (dir) => send(socket, ClientUpdate, { type: 'rotate', dir }));
    observe(state.local, 'lock_down', () => send(socket, ClientUpdate, { type: 'lock_down' }));
    observe(state.local, 'new_falling', () => send(socket, ClientUpdate, { type: 'new_falling' }));
    observe(state.local, 'end_game', () => {
      send(socket, ClientUpdate, { type: 'end_game' });
      check_exit();
    });

    cleanup = play(user, state.local);
  });

  on(receive(socket, BroadcastUpdate), ([index, update]) => {
    let target = state.members[index].game!;
    switch (update.type) {
      case 'hold': target.hold(); break;
      case 'drop': target.drop(update.distance); break;
      case 'shift': target.shift(update.dir); break;
      case 'rotate': target.rotate(update.dir); break;
      case 'lock_down': target.lock_down(); break;
      case 'new_falling': target.new_falling(); break;
      case 'end_game': target.end_game(); check_exit(); break;
    }
  });

  on(receive(socket, RoomCode), code => {
    if (code != state.code) {
      const url = new URL(window.location.href);
      url.searchParams.delete('code');
      window.history.replaceState(null, document.title, url.pathname + url.search);
    }

    state.code = code;
  });

  on(receive(socket, RoomState), ({ index, names }) => {
    state.members = names.map(name => ({ name, game: null }));
    state.index = index;

    if (state.members.length > 1) {
      const url = new URL(window.location.href);
      url.searchParams.set('code', state.code!);
      window.history.replaceState(null, document.title, url.pathname + url.search);
    }
  });

  return state;
}
