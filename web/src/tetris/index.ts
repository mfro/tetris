import alea from 'alea';
import { customRef, reactive, shallowReactive, shallowRef } from 'vue';

import { Vec } from '@/vec';
import { assert } from '@mfro/ts-common/assert';
import { A, C, DOWN, isKeyDown, LEFT, onKeyDown, onKeyUp, RIGHT, S, SHIFT, SPACE, UP, X, Z } from '@/input';

import { GameRules, GameState, tetronimos, UserPreferences } from './config';

const down = new Vec(0, 1);

export interface Tile {
  id: number;
  kind: TetronimoKind;
}

export interface Tetronimo {
  id: number;
  kind: TetronimoKind;
  position: Vec;
  rotation: number;
}

export interface TetronimoKind {
  size: number;
  rotations: Vec[][];
}

export interface Game {
  rules: GameRules;
  state: GameState;

  collide(t: Tetronimo): boolean;
  hard_drop_position(t: Tetronimo): Vec;

  hold(): void;
  drop(distance: number): number;
  shift(dir: 1 | -1): boolean;
  rotate(dir: 1 | -1): boolean;
  lock_down(): void;
  new_falling(): boolean;
  end_game(): void;
}

/** get the absolute positions of all the pieces of a tetronimo */
export function pieces(t: Tetronimo): Vec[] {
  return t.kind.rotations[t.rotation]
    .map(v => Vec.add(t.position, v));
}

/** create an empty row */
export function empty_row(rules: GameRules) {
  let row = [];
  for (let x = 0; x < rules.field_size.x; ++x) {
    row[x] = null;
  }
  return row;
}

/** create an empty field */
export function empty_field(rules: GameRules) {
  let field = [];
  for (let y = 0; y < rules.field_size.y; ++y) {
    field[y] = empty_row(rules);
  }
  return field;
}

/** create a new game */
export function empty_state(rules: GameRules, seed: number | null = null): GameState {
  if (seed === null)
    seed = alea(Math.random()).uint32();

  return {
    seed,
    field: empty_field(rules),

    falling: null,
    fall_queue: [],
    holding: null,
    hold_available: true,

    dead: false,
  };
}

export function reactive_state(inner: GameState): GameState {
  let falling = inner.falling;

  return reactive({
    seed: inner.seed,
    field: inner.field.map(row => shallowReactive(row)),

    falling: customRef<typeof falling>((track, trigger) => ({
      get: () => { track(); return falling; },
      set: (v) => { falling = v && shallowReactive(v); trigger(); },
    })),
    fall_queue: shallowReactive([]),
    holding: shallowRef(null),
    hold_available: inner.hold_available,

    dead: inner.dead,
  });
}

export function new_game(rules: GameRules, state: GameState): Game {
  let next_id = 0;
  let holding = false;

  function collide(t: Tetronimo) {
    for (let part of pieces(t)) {
      if (part.x < 0 || part.x >= rules.field_size.x || part.y >= rules.field_size.y)
        return true;

      if (part.y < 0)
        continue;

      let tile = state.field[part.y][part.x];
      if (tile != null)
        return true;
    }

    return false;
  }

  function hard_drop_position(t: Tetronimo) {
    let bottom = t.position;
    while (true) {
      let position = Vec.add(bottom, down);
      if (collide({ ...t, position })) break;
      bottom = position;
    }

    return bottom;
  }

  function hold() {
    if (state.dead || state.falling == null) return;

    let next_fall = state.holding;
    state.holding = state.falling?.kind ?? null;

    if (next_fall) {
      state.fall_queue.unshift(next_fall);
    }

    state.falling = null;
    state.hold_available = false;
    holding = true;
  }

  function drop(distance: number) {
    if (state.dead || state.falling == null) return 0;

    for (let i = 0; i < distance; ++i) {
      let position = Vec.add(state.falling.position, down);
      if (collide({ ...state.falling, position }))
        return i;

      state.falling.position = position;
    }

    return distance;
  }

  function shift(dir: 1 | -1) {
    if (state.dead || state.falling == null) return false;

    let position = Vec.add(state.falling.position, new Vec(dir, 0));
    if (!collide({ ...state.falling, position })) {
      state.falling.position = position;
      return true;
    }

    return false;
  }

  function rotate(dir: 1 | -1) {
    if (state.dead || state.falling == null) return false;

    let rotation = (state.falling.rotation + dir) % 4;
    if (rotation < 0) rotation += 4;

    let kick_info = rules.wall_kicks.get(state.falling.kind);
    assert(kick_info != null, `no kick info for piece`);

    let kicks;
    if (dir == 1)
      kicks = kick_info[state.falling.rotation * 2];
    else
      kicks = kick_info[rotation * 2 + 1];

    for (let kick of kicks) {
      let position = Vec.add(state.falling.position, kick)

      if (!collide({ ...state.falling, position, rotation })) {
        state.falling.position = position;
        state.falling.rotation = rotation;
        return true;
      }
    }

    return false;
  }

  function lock_down() {
    if (state.dead || state.falling == null) return;

    for (let part of pieces(state.falling)) {
      state.field[part.y][part.x] = {
        id: state.falling.id,
        kind: state.falling.kind,
      };
    }

    let cleared = 0;
    for (let y = 0; y < rules.field_size.y; ++y) {
      if (state.field[y].every(t => t != null)) {
        for (let i = y; i > 0; --i) {
          Object.assign(state.field[i], state.field[i - 1]);
        }

        Object.assign(state.field[0], empty_row(rules));
        cleared += 1;
      }
    }

    if (cleared > 0) {
      console.log(`cleared ${cleared} lines`);
    }
  }

  function new_falling() {
    if (state.dead) return false;

    if (state.fall_queue.length - 1 < rules.bag_preview) {
      let random = alea(state.seed);
      state.seed = random.uint32();

      let pool = tetronimos.all.slice();
      while (pool.length > 0) {
        let i = Math.floor(random() * pool.length);
        let kind = pool.splice(i, 1)[0];
        state.fall_queue.push(kind);
      }
    }

    let kind = state.fall_queue[0];
    let position = new Vec(5 - Math.ceil(kind.size / 2), rules.field_size.y / 2 - 2);
    let rotation = 0;

    let falling = { id: next_id++, kind, position, rotation };
    state.hold_available = !holding;
    holding = false;

    if (collide(falling)) {
      return false;
    } else {
      state.fall_queue.shift();
      state.falling = falling;
      return true;
    }
  }

  function end_game() {
    state.dead = true;
    state.falling = null;
  }

  return {
    rules, state,

    collide,
    hard_drop_position,

    hold,
    drop,
    shift,
    rotate,
    lock_down,
    new_falling,
    end_game,
  };
}

export function play(user: UserPreferences, game: Game) {
  let move_reset = 0;
  let lock_progress = 0;
  let fall_progress = 0;

  let repeating = false;
  let shift_left = false;
  let shift_right = false;
  let repeat_shift = 0 as 0 | 1 | -1;
  let repeat_delay = 0;

  new_falling();

  /** generate a new falling tetronimo, filling the bag if needed */
  function new_falling() {
    if (game.state.dead) return;

    if (game.new_falling()) {
      move_reset = game.rules.move_reset_limit ?? Infinity;
      try_drop();
    } else {
      game.end_game();
    }
  }

  /** determine if the falling piece is resting on the ground */
  function is_on_ground(t: Tetronimo) {
    let position = Vec.add(t.position, down);

    return game.collide({ ...t, position });
  }

  /** lock down the falling tetronimo */
  function lock_down() {
    game.lock_down();
    new_falling();
  }

  /** try to drop the falling tetronimo one tile */
  function try_drop() {
    if (game.state.dead || game.state.falling == null) return;

    fall_progress = 0;

    if (game.drop(1) > 0) {
      move_reset = game.rules.move_reset_limit ?? Infinity;
    }
  }

  /** reset the lock_delay, consuming a move reset */
  function try_move_reset() {
    if (game.state.dead || game.state.falling == null) return;

    if (lock_progress > 0 && move_reset > 0) {
      move_reset -= 1;
      lock_progress = 0;
    }
  }

  /** hold a piece */
  function hold() {
    if (!game.state.hold_available) return;

    game.hold();
    new_falling();
  }

  /** attempt to shift the falling tetronimo */
  function shift(change: 1 | -1) {
    if (game.state.dead || game.state.falling == null) return;

    if (game.shift(change)) {
      try_move_reset();

      if (user.autoshift) {
        repeat_delay = repeating
          ? user.autoshift.delay
          : user.autoshift.initial_delay;

        repeating = true;
      }
    }
  }

  /** attempt to rotate the falling tetronimo */
  function rotate(change: 1 | -1) {
    if (game.state.dead || game.state.falling == null) return;

    if (game.rotate(change)) {
      try_move_reset();
      return;
    }
  }

  /** hard drop the falling tetronimo */
  function hard_drop() {
    if (game.state.dead || game.state.falling == null) return;

    game.drop(20);
    lock_down();
  }

  /** shift input handler */
  function press_shift(dir: 1 | -1) {
    if (game.state.dead || game.state.falling == null) return;

    repeating = false;
    if (dir == 1)
      shift_right = true;
    else
      shift_left = true;
    repeat_shift = dir;
    shift(dir);
  }

  /** shift input handler */
  function release_shift(dir: 1 | -1) {
    if (game.state.dead || game.state.falling == null) return;

    if (dir == 1)
      shift_right = false;
    else
      shift_left = false;

    if (user.autoshift && repeat_shift == dir) {
      repeat_delay = repeating
        ? user.autoshift.delay
        : user.autoshift.initial_delay;
    }

    repeat_shift = shift_left ? -1 : shift_right ? 1 : 0;
  }

  onKeyDown(Z, () => rotate(-1));
  onKeyDown(A, () => rotate(-1));
  onKeyDown(X, () => rotate(1));
  onKeyDown(S, () => rotate(1));
  onKeyDown(UP, () => rotate(1));

  onKeyUp(LEFT, () => release_shift(-1));
  onKeyDown(LEFT, () => press_shift(-1));
  onKeyUp(RIGHT, () => release_shift(1));
  onKeyDown(RIGHT, () => press_shift(1));

  // onKeyDown(DOWN, () => try_drop());

  onKeyDown(SPACE, () => hard_drop());

  onKeyDown(C, () => hold());
  onKeyDown(SHIFT, () => hold());

  let cancel = setInterval(update, 1000 / 60);
  function update() {
    if (game.state.dead) {
      return clearInterval(cancel);
    }

    if (repeat_delay > 0) {
      repeat_delay -= 1;
    } else if (user.autoshift && repeat_shift != 0) {
      shift(repeat_shift);
    }

    if (game.state.falling != null) {
      if (is_on_ground(game.state.falling)) {
        lock_progress += 1 / game.rules.lock_delay;
        fall_progress = Math.min(fall_progress, Math.ceil(1 / game.rules.fall_delay));

        if (lock_progress >= 1) {
          fall_progress = 0;
          lock_progress = 0;
          lock_down();
        }
      } else {
        if (isKeyDown(DOWN))
          fall_progress += 1 / game.rules.fall_delay * user.soft_drop;
        else
          fall_progress += 1 / game.rules.fall_delay

        if (fall_progress > 1) {
          let drop = Math.floor(fall_progress);
          let move = game.drop(drop);
          if (move > 0)
            move_reset = game.rules.move_reset_limit ?? Infinity;
          if (move == drop)
            fall_progress -= drop;
          else
            fall_progress = 0;
        }
      }
    }
  }

  return () => clearInterval(cancel);
}
