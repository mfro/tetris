import { customRef, reactive, shallowReactive, shallowRef } from 'vue';

import { Vec } from '@/vec';
import { assert } from '@/util';
import { A, C, DOWN, isKeyDown, LEFT, onKeyDown, onKeyUp, RIGHT, S, SHIFT, SPACE, UP, X, Z } from '@/input';

import { GameRules, GameState, tetronimos, UserConfig as UserOptions, wall_kicks } from './config';

import { render as basic_render } from './render/basic';
import { render as pixi_render } from './render/pixi';

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
  rules: GameRules,
  state: GameState,
  hard_drop_position(t: Tetronimo): Vec;
}

/** get the absolute positions of all the pieces of a tetronimo */
export function pieces(t: Tetronimo): Vec[] {
  return t.kind.rotations[t.rotation]
    .map(v => Vec.add(t.position, v));
}

/** create an empty row */
function empty_row(rules: GameRules) {
  let row = [];
  for (let x = 0; x < rules.field_size.x; ++x) {
    row[x] = null;
  }
  return row;
}

/** create an empty field */
function empty_field(rules: GameRules) {
  let field = [];
  for (let y = 0; y < rules.field_size.y; ++y) {
    field[y] = empty_row(rules);
  }
  return field;
}

/** create a new game */
export function new_game(rules: GameRules): GameState {
  return {
    field: empty_field(rules),

    falling: null,
    fall_queue: [],
    holding: null,
    hold_available: true,

    dead: false,
  };
}

export function reactive_game(inner: GameState): GameState {
  let falling = inner.falling;

  return reactive({
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

export function run_game(rules: GameRules, user: UserOptions, game: GameState): Game {
  const down = new Vec(0, 1);
  let next_id = 0;

  let fall_time = 0;
  let move_reset = 0;

  let repeating = false;
  let shift_left = false;
  let shift_right = false;
  let repeat_shift = 0 as 0 | 1 | -1;
  let repeat_delay = 0;

  new_falling();

  /** generate a new falling tetronimo, filling the bag if needed */
  function new_falling() {
    if (game.fall_queue.length - 1 < rules.bag_preview) {
      let pool = tetronimos.all.slice();
      while (pool.length > 0) {
        let i = Math.floor(Math.random() * pool.length);
        let kind = pool.splice(i, 1)[0];
        game.fall_queue.push(kind);
      }
    }

    let kind = game.fall_queue.shift()!;
    let position = new Vec(5 - Math.ceil(kind.size / 2), rules.field_size.y / 2 - 2);
    let rotation = 0;

    game.falling = { id: next_id++, kind, position, rotation };
    game.hold_available = true;
    move_reset = rules.move_reset_limit ?? Infinity;

    if (collide(game.falling)) {
      console.log('collide', game.falling);
      game.falling = null;
      game.dead = true;
    } else {
      try_drop();
    }
  }

  /** detect collisions of a tetronimo with the field, checking contents and borders */
  function collide(t: Tetronimo) {
    for (let part of pieces(t)) {
      if (part.x < 0 || part.x >= rules.field_size.x || part.y >= rules.field_size.y)
        return true;

      if (part.y < 0)
        continue;

      let tile = game.field[part.y][part.x];
      if (tile != null)
        return true;
    }

    return false;
  }

  /** find the position that the tetronimo would hard drop to */
  function hard_drop_position(t: Tetronimo) {
    let bottom = t.position;
    while (true) {
      let position = Vec.add(bottom, down);
      if (collide({ ...t, position })) break;
      bottom = position;
    }

    return bottom;
  }

  /** determine if the falling piece is resting on the ground */
  function is_on_ground(t: Tetronimo) {
    let position = Vec.add(t.position, down);

    return collide({ ...t, position });
  }

  /** lock down the falling tetronimo */
  function lock_down() {
    if (game.falling == null) return;

    for (let part of pieces(game.falling)) {
      game.field[part.y][part.x] = {
        id: game.falling.id,
        kind: game.falling.kind,
      };
    }

    new_falling();
  }

  /** try to drop the falling tetronimo one tile */
  function try_drop() {
    if (!game.falling) return false;

    fall_time = 0;

    let position = Vec.add(game.falling.position, down);
    if (!collide({ ...game.falling, position })) {
      game.falling.position = position;
      move_reset = rules.move_reset_limit ?? Infinity;
      return true;
    } else {
      return false;
    }
  }

  /** reset the lock_delay, consuming a move reset */
  function try_move_reset() {
    if (game.falling == null) return;

    if (is_on_ground(game.falling) && move_reset > 0) {
      move_reset -= 1;
      fall_time = 0;
    }
  }

  /** hold a tetronimo, swapping the held piece out if one exists */
  function hold() {
    if (game.dead) return;

    let next_fall = game.holding;
    game.holding = game.falling?.kind ?? null;

    if (next_fall) {
      game.fall_queue.unshift(next_fall);
    }

    new_falling();
    game.hold_available = false;
  }

  /** attempt to shift the falling tetronimo */
  function shift(change: 1 | -1) {
    if (game.dead || game.falling == null) return;

    let position = Vec.add(game.falling.position, new Vec(change, 0));
    if (!collide({ ...game.falling, position })) {
      game.falling.position = position;

      if (user.autoshift) {
        repeat_delay = repeating
          ? user.autoshift.delay
          : user.autoshift.initial_delay;

        repeating = true;
      }

      try_move_reset();
    }
  }

  /** attempt to rotate the falling tetronimo */
  function rotate(change: 1 | -1) {
    if (game.dead || game.falling == null) return;

    let rotation = (game.falling.rotation + change) % 4;
    if (rotation < 0) rotation += 4;

    let kick_info = rules.wall_kicks.get(game.falling.kind);
    assert(kick_info != null, `no kick info for piece`);

    let kicks;
    if (change == 1)
      kicks = kick_info[game.falling.rotation * 2];
    else
      kicks = kick_info[rotation * 2 + 1];

    for (let kick of kicks) {
      let position = Vec.add(game.falling.position, kick)

      if (!collide({ ...game.falling, position, rotation })) {
        game.falling.position = position;
        game.falling.rotation = rotation;
        try_move_reset();
        return;
      }
    }
  }

  /** hard drop the falling tetronimo */
  function hard_drop() {
    if (game.dead || game.falling == null) return;

    game.falling.position = hard_drop_position(game.falling);
    lock_down();
  }

  /** shift input handler */
  function press_shift(dir: 1 | -1) {
    if (game.dead || game.falling == null) return;

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
    if (game.dead || game.falling == null) return;

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

  onKeyDown(DOWN, () => try_drop());

  onKeyDown(SPACE, () => hard_drop());

  onKeyDown(C, () => game.hold_available && hold());
  onKeyDown(SHIFT, () => game.hold_available && hold());

  let cancel = setInterval(update, 1000 / 60);
  function update() {
    if (game.dead) {
      return clearInterval(cancel);
    }

    if (repeat_delay > 0) {
      repeat_delay -= 1;
    } else if (user.autoshift && repeat_shift != 0) {
      shift(repeat_shift);
    }

    while (game.falling) {
      let fall_delay;
      if (is_on_ground(game.falling))
        fall_delay = rules.lock_delay;
      else if (isKeyDown(DOWN))
        fall_delay = rules.fall_delay / user.soft_drop;
      else
        fall_delay = rules.fall_delay;

      if (fall_time < fall_delay) break;

      let position = Vec.add(game.falling.position, down);
      if (!collide({ ...game.falling, position })) {
        game.falling.position = position;
        move_reset = rules.move_reset_limit ?? Infinity;
        fall_time -= fall_delay;
      } else {
        fall_time = 0;
        lock_down();
      }
    }

    fall_time += 1;

    let cleared = 0;
    for (let y = 0; y < rules.field_size.y; ++y) {
      if (game.field[y].every(t => t != null)) {
        for (let i = y; i > 0; --i) {
          Object.assign(game.field[i], game.field[i - 1]);
        }

        Object.assign(game.field[0], empty_row(rules));
        cleared += 1;
      }
    }

    if (cleared > 0) {
      console.log(`cleared ${cleared} lines`);
    }
  }

  return { rules, state: game, hard_drop_position };
}
