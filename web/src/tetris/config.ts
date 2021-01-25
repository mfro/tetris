import { Vec } from '@/vec';

import { TetronimoKind, Tile, Tetronimo } from '.';

export namespace tetronimos {
  function define(size: number, raw_tiles: [number, number][]): TetronimoKind {
    let rotation = raw_tiles.map(t => new Vec(t[0], t[1]));
    let rotations = [rotation];

    for (let i = 0; i < 3; ++i) {
      rotation = rotation.map(v => new Vec(size - 1 - v.y, v.x));
      rotations.push(rotation);
    }

    return {
      size,
      rotations,
    };
  }

  export const I = define(4, [[0, 1], [1, 1], [2, 1], [3, 1]]);
  export const O = define(2, [[0, 0], [0, 1], [1, 0], [1, 1]]);
  export const T = define(3, [[1, 0], [0, 1], [1, 1], [2, 1]]);
  export const J = define(3, [[0, 0], [0, 1], [1, 1], [2, 1]]);
  export const L = define(3, [[2, 0], [0, 1], [1, 1], [2, 1]]);
  export const S = define(3, [[1, 0], [2, 0], [0, 1], [1, 1]]);
  export const Z = define(3, [[0, 0], [1, 0], [1, 1], [2, 1]]);

  export const all = [I, O, T, J, L, S, Z];
}

export namespace wall_kicks {
  function define_kick_data(raw: [number, number][][]) {
    return raw.map(a => [Vec.zero, ...a.map(a => new Vec(a[0], -a[1]))]);
  }

  const no_kick_data = define_kick_data([
    [[0, 0]], // 0 -> 1
    [[0, 0]], // 1 -> 0
    [[0, 0]], // 1 -> 2
    [[0, 0]], // 2 -> 1
    [[0, 0]], // 2 -> 3
    [[0, 0]], // 3 -> 2
    [[0, 0]], // 3 -> 0
    [[0, 0]], // 0 -> 3
  ]);

  const base_kick_data = define_kick_data([
    [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]], // 0 -> 1
    [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]], // 1 -> 0
    [[0, 0], [+1, 0], [+1, -1], [0, +2], [+1, +2]], // 1 -> 2
    [[0, 0], [-1, 0], [-1, +1], [0, -2], [-1, -2]], // 2 -> 1
    [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]], // 2 -> 3
    [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]], // 3 -> 2
    [[0, 0], [-1, 0], [-1, -1], [0, +2], [-1, +2]], // 3 -> 0
    [[0, 0], [+1, 0], [+1, +1], [0, -2], [+1, -2]], // 0 -> 3
  ]);

  const base_i_kick_data = define_kick_data([
    [[0, 0], [-2, 0], [+1, 0], [-2, -1], [+1, +2]], // 0 -> 1
    [[0, 0], [+2, 0], [-1, 0], [+2, +1], [-1, -2]], // 1 -> 0
    [[0, 0], [-1, 0], [+2, 0], [-1, +2], [+2, -1]], // 1 -> 2
    [[0, 0], [+1, 0], [-2, 0], [+1, -2], [-2, +1]], // 2 -> 1
    [[0, 0], [+2, 0], [-1, 0], [+2, +1], [-1, -2]], // 2 -> 3
    [[0, 0], [-2, 0], [+1, 0], [-2, -1], [+1, +2]], // 3 -> 2
    [[0, 0], [+1, 0], [-2, 0], [+1, -2], [-2, +1]], // 3 -> 0
    [[0, 0], [-1, 0], [+2, 0], [-1, +2], [+2, -1]], // 0 -> 3
  ]);

  const asira_i_kick_data = define_kick_data([
    [[0, 0], [-2, 0], [+1, 0], [+1, +2], [-2, -1]], // 0 -> 1
    [[0, 0], [+2, 0], [-1, 0], [+2, +1], [-1, -2]], // 1 -> 0
    [[0, 0], [-1, 0], [+2, 0], [-1, +2], [+2, -1]], // 1 -> 2
    [[0, 0], [-2, 0], [+1, 0], [-2, +1], [+1, -1]], // 2 -> 1
    [[0, 0], [+2, 0], [-1, 0], [+2, +1], [-1, -1]], // 2 -> 3
    [[0, 0], [+1, 0], [-2, 0], [+1, +2], [-2, -1]], // 3 -> 2
    [[0, 0], [-2, 0], [+1, 0], [-2, +1], [+1, -2]], // 3 -> 0
    [[0, 0], [+2, 0], [-1, 0], [-1, +2], [+2, -1]], // 0 -> 3
  ]);

  export const standard = new Map([
    [tetronimos.I, base_i_kick_data],
    [tetronimos.O, base_kick_data],
    [tetronimos.T, base_kick_data],
    [tetronimos.J, base_kick_data],
    [tetronimos.L, base_kick_data],
    [tetronimos.S, base_kick_data],
    [tetronimos.Z, base_kick_data],
  ]);

  export const asira = new Map([
    [tetronimos.I, asira_i_kick_data],
    [tetronimos.O, base_kick_data],
    [tetronimos.T, base_kick_data],
    [tetronimos.J, base_kick_data],
    [tetronimos.L, base_kick_data],
    [tetronimos.S, base_kick_data],
    [tetronimos.Z, base_kick_data],
  ]);

  export const none = new Map([
    [tetronimos.I, no_kick_data],
    [tetronimos.O, no_kick_data],
    [tetronimos.T, no_kick_data],
    [tetronimos.J, no_kick_data],
    [tetronimos.L, no_kick_data],
    [tetronimos.S, no_kick_data],
    [tetronimos.Z, no_kick_data],
  ]);
}

export interface GameRules {
  // size of the visible playfield
  field_size: Vec;

  // updates between the falling piece moving down
  fall_delay: number;
  // delay before the falling pieces locks into place
  lock_delay: number;
  // limit on how many times rotating or shifting the piece can reset the lock delay. null indicates no limit
  move_reset_limit: null | number;

  // wall kick data
  wall_kicks: Map<TetronimoKind, Vec[][]>;

  // number of Tetronimos to pre-generate in the queue
  bag_preview: 5,
}

export interface UserPreferences {
  // autoshift information for repeating shifts while input is held
  autoshift: null | { delay: number, initial_delay: number };
  // multiplier for fall_delay while soft drop is held
  soft_drop: number;
}

export interface GameState {
  seed: number;
  field: (Tile | null)[][],

  falling: Tetronimo | null,
  fall_queue: TetronimoKind[],

  holding: TetronimoKind | null,
  hold_available: boolean,

  dead: boolean;
}

export type Option =
  | { type: 'constant', value: any }
  | { type: 'optional', inner: Option }
  | { name: string, description: string } & (
    | { type: 'natural' }
    | { type: 'rational' }
    | { type: 'select', options: [string, any][] }
    | { type: 'object', inner: Definition<any> }
  );

function constant(value: any): Option {
  return { type: 'constant', value };
}

function optional(inner: Option): Option {
  return { type: 'optional', inner };
}

function natural(name: string, description: string): Option {
  return { type: 'natural', name, description };
}

function rational(name: string, description: string): Option {
  return { type: 'rational', name, description };
}

function select(name: string, description: string, options: [string, any][]): Option {
  return { type: 'select', name, description, options };
}

function object<T>(name: string, description: string, inner: Definition<T>): Option {
  return { type: 'object', name, description, inner };
}

type Definition<T> = {
  [K in keyof T]: Option;
}

export const GameDefinition: Definition<GameRules> = {
  field_size: constant(new Vec(10, 40)),

  fall_delay: rational('Drop Delay', 'Drop delay for falling pieces (frames per tile)'),

  lock_delay: rational('Lock Delay', 'Lock down delay (frames)'),

  move_reset_limit: optional(rational('Move Reset Limit', 'Maximum number of times the Lock Delay can be reset by successful shifts or rotates')),

  wall_kicks: select('Wall Kicks', 'Wall kick data', [
    ['No Kicks', wall_kicks.none],
    ['Standard', wall_kicks.standard],
    ['Asira', wall_kicks.asira],
  ]),

  bag_preview: natural('Preview Size', 'Number of pieces in the preview'),
};

export const UserDefinition: Definition<UserPreferences> = {
  autoshift: optional(object('Autoshift', 'Configure repeated shifts while input is held', {
    delay: rational('Delay', 'Delay between repeated shifts (frames)'),
    initial_delay: rational('Initial Delay', 'Delay after first shift before repeating (frames)'),
  })),

  soft_drop: rational('Soft Drop Multiplier', 'Multiplier for Drop Delay while soft dropping'),
}
