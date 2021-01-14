import { A, C, DOWN, isKeyDown, LEFT, onKeyDown, RIGHT, S, SHIFT, SPACE, UP, X, Z } from './input';
import { assert, zip } from './util';
import { Vec } from './vec';

interface Tile {
  id: number;
  kind: TetronimoKind;
}

interface Tetronimo {
  id: number;
  kind: TetronimoKind;
  position: Vec;
  rotation: number;
}

interface TetronimoKind {
  size: number;
  color: string;
  rotations: Vec[][];
}

function define(size: number, color: string, raw_tiles: [number, number][]): TetronimoKind {
  let rotation = raw_tiles.map(t => new Vec(t[0], t[1]));
  let rotations = [rotation];

  for (let i = 0; i < 3; ++i) {
    rotation = rotation.map(v => new Vec(size - 1 - v.y, v.x));
    rotations.push(rotation);
  }

  return {
    size,
    color,
    rotations,
  };
}

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

const kinds: TetronimoKind[] = [
  define(4, '#0f9bd7', [[0, 1], [1, 1], [2, 1], [3, 1]]), // I
  define(2, '#e39f02', [[0, 0], [0, 1], [1, 0], [1, 1]]), // O
  define(3, '#af298a', [[1, 0], [0, 1], [1, 1], [2, 1]]), // T
  define(3, '#2141c6', [[0, 0], [0, 1], [1, 1], [2, 1]]), // J
  define(3, '#e35b02', [[2, 0], [0, 1], [1, 1], [2, 1]]), // L
  define(3, '#59b101', [[1, 0], [2, 0], [0, 1], [1, 1]]), // S
  define(3, '#d70f37', [[0, 0], [1, 0], [1, 1], [2, 1]]), // Z
];

const default_wall_kicks = new Map([
  [kinds[0], base_i_kick_data],
  [kinds[1], base_kick_data],
  [kinds[2], base_kick_data],
  [kinds[3], base_kick_data],
  [kinds[4], base_kick_data],
  [kinds[5], base_kick_data],
  [kinds[6], base_kick_data],
]);

const asira_wall_kicks = new Map([
  [kinds[0], asira_i_kick_data],
  [kinds[1], base_kick_data],
  [kinds[2], base_kick_data],
  [kinds[3], base_kick_data],
  [kinds[4], base_kick_data],
  [kinds[5], base_kick_data],
  [kinds[6], base_kick_data],
]);

const no_wall_kicks = new Map([
  [kinds[0], no_kick_data],
  [kinds[1], no_kick_data],
  [kinds[2], no_kick_data],
  [kinds[3], no_kick_data],
  [kinds[4], no_kick_data],
  [kinds[5], no_kick_data],
  [kinds[6], no_kick_data],
]);

interface GameRules {
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

interface UserConfig {
  // autoshift information for repeating shifts while input is held
  autoshift: null | { delay: number, initial_delay: number };
  // multiplier for fall_delay while soft drop is held
  soft_drop: number;
}

interface GameState {
  field: (Tile | null)[][],

  falling: Tetronimo | null,
  fall_queue: TetronimoKind[],
  fall_delay: number,

  move_reset: number,

  repeating: boolean,
  repeat_shift: number,
  repeat_delay: number,

  holding: TetronimoKind | null,
  hold_available: boolean,
}

/** get the absolute positions of all the pieces of a tetronimo */
function pieces(t: Tetronimo): Vec[] {
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
function new_game(rules: GameRules): GameState {
  return {
    field: empty_field(rules),

    falling: null,
    fall_queue: [],
    fall_delay: 0,

    move_reset: 0,

    repeating: false,
    repeat_shift: 0,
    repeat_delay: 0,

    holding: null,
    hold_available: true,
  };
}

function run_game(rules: GameRules, user: UserConfig, game: GameState) {
  const down = new Vec(0, 1);
  let next_id = 0;

  new_falling();

  /** generate a new falling tetronimo, filling the bag if needed */
  function new_falling() {
    if (game.fall_queue.length < rules.bag_preview) {
      let pool = kinds.slice();
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
    game.fall_delay = 0;

    if (collide(game.falling)) {
      clearInterval(cancel);
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
  function drop_position(t: Tetronimo) {
    let bottom = t.position;
    while (true) {
      let position = Vec.add(bottom, down);
      if (collide({ ...t, position })) break;
      bottom = position;
    }

    return bottom;
  }

  /** lock down the falling tetronimo */
  function land() {
    if (game.falling == null) return false;

    for (let part of pieces(game.falling)) {
      game.field[part.y][part.x] = {
        id: game.falling.id,
        kind: game.falling.kind,
      };
    }

    new_falling();
  }

  /** determine if the falling piece is resting on the ground */
  function is_on_ground(t: Tetronimo) {
    let position = Vec.add(t.position, down);

    return collide({ ...t, position });
  }

  /** reset the lock_delay, consuming a move reset */
  function reset_lock_delay() {
    if (game.falling == null) return;

    if (is_on_ground(game.falling) && game.move_reset > 0) {
      game.move_reset -= 1;
      game.fall_delay = rules.lock_delay;
    }
  }

  /** hold a tetronimo, swapping the held piece out if one exists */
  function hold() {
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
    if (game.falling == null) return;

    let position = Vec.add(game.falling.position, new Vec(change, 0));
    if (!collide({ ...game.falling, position })) {
      game.falling.position = position;

      if (user.autoshift) {
        game.repeat_delay = game.repeating
          ? user.autoshift.delay
          : user.autoshift.initial_delay;

        game.repeating = true;
      }

      reset_lock_delay();
    }
  }

  /** attempt to rotate the falling tetronimo */
  function rotate(change: 1 | -1) {
    if (game.falling == null) return;

    let rotation = (game.falling.rotation + change) % 4;
    if (rotation < 0) rotation += 4;

    let kick_info = rules.wall_kicks.get(game.falling.kind);
    assert(kick_info != null, `no kick info for piece ${kinds.indexOf(game.falling.kind)}`);

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
        reset_lock_delay();
        return;
      }
    }
  }

  /** hard drop the falling tetronimo */
  function hard_drop() {
    if (game.falling == null) return false;
    game.falling.position = drop_position(game.falling);
    land();
  }

  onKeyDown(Z, () => rotate(-1));
  onKeyDown(A, () => rotate(-1));
  onKeyDown(X, () => rotate(1));
  onKeyDown(S, () => rotate(1));
  onKeyDown(UP, () => rotate(1));

  onKeyDown(LEFT, () => { game.repeat_shift = -1; game.repeating = false; });
  onKeyDown(RIGHT, () => { game.repeat_shift = 1; game.repeating = false; });
  onKeyDown(DOWN, () => game.fall_delay = 0);

  onKeyDown(SPACE, () => hard_drop());

  onKeyDown(C, () => game.hold_available && hold());
  onKeyDown(SHIFT, () => game.hold_available && hold());

  let cancel = setInterval(update, 1000 / 60);
  function update() {
    if (game.repeat_delay > 0) {
      game.repeat_delay -= 1;
    } else if (isKeyDown(LEFT) || isKeyDown(RIGHT)) {
      shift(game.repeat_shift as 1 | -1);
    }

    if (game.fall_delay > 0) {
      game.fall_delay -= 1;
    } else if (game.falling) {
      let position = Vec.add(game.falling.position, down);
      if (!collide({ ...game.falling, position })) {
        game.falling.position = position;

        game.fall_delay = is_on_ground(game.falling)
          ? rules.lock_delay
          : rules.fall_delay;

        if (isKeyDown(DOWN))
          game.fall_delay /= user.soft_drop;

        game.move_reset = rules.move_reset_limit ?? Infinity;
      } else {
        land();
      }
    }

    let cleared = 0;
    for (let y = 0; y < rules.field_size.y; ++y) {
      if (game.field[y].every(t => t != null)) {
        game.field.splice(y, 1);
        game.field.unshift(empty_row(rules));
        cleared += 1;
      }
    }

    if (cleared > 0) {
      console.log(`cleared ${cleared} lines`);
    }
  }

  return { drop_position };
}

export function tetris(canvas: HTMLCanvasElement) {
  const unit_size = 32;
  const pixel = 1 / unit_size;

  const rules: GameRules = {
    field_size: new Vec(10, 40),
    fall_delay: 30,
    lock_delay: 30,
    move_reset_limit: 15,

    wall_kicks: asira_wall_kicks,

    bag_preview: 5,
  };

  const user: UserConfig = {
    autoshift: { delay: 2, initial_delay: 10 },
    soft_drop: 10,
  };

  canvas.width = (rules.field_size.x + 12) * unit_size;
  canvas.height = (rules.field_size.y / 2) * unit_size;
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;

  const context = canvas.getContext('2d')!;
  assert(context != null, 'no context');

  const game = new_game(rules);
  const runner = run_game(rules, user, game);

  function tile_at(pos: Vec) {
    if (pos.x < 0 || pos.x >= rules.field_size.x
      || pos.y < 0 || pos.y >= rules.field_size.y)
      return null;

    return game.field[pos.y][pos.x];
  }

  const adj8 = [
    new Vec(-1, -1),
    new Vec(0, -1),
    new Vec(1, -1),
    new Vec(1, 0),
    new Vec(1, 1),
    new Vec(0, 1),
    new Vec(-1, 1),
    new Vec(-1, 0),
  ];

  /** draw a single tile of a tetronimo */
  function draw_tile(kind: TetronimoKind, position: Vec, surroundings: boolean[]) {
    let p = position;

    context.fillStyle = kind.color;
    context.fillRect(p.x, p.y, 1, 1);

    const border = 1 / 8;

    context.beginPath();
    context.lineCap = 'butt';
    context.lineWidth = border;
    context.strokeStyle = '#00000040';

    let ops = [
      () => {
        context.moveTo(p.x, p.y + border / 2);
        context.lineTo(p.x + border / 2, p.y + border / 2);
        context.lineTo(p.x + border / 2, p.y);
      },

      () => {
        context.moveTo(p.x, p.y + border / 2);
        context.lineTo(p.x + 1, p.y + border / 2);
      },

      () => {
        context.moveTo(p.x + 1 - border / 2, p.y);
        context.lineTo(p.x + 1 - border / 2, p.y + border / 2);
        context.lineTo(p.x + 1, p.y + border / 2);
      },

      () => {
        context.moveTo(p.x - border / 2 + 1, p.y);
        context.lineTo(p.x - border / 2 + 1, p.y + 1);
      },

      () => {
        context.moveTo(p.x + 1, p.y + 1 - border / 2);
        context.lineTo(p.x + 1 - border / 2, p.y + 1 - border / 2);
        context.lineTo(p.x + 1 - border / 2, p.y + 1);
      },

      () => {
        context.moveTo(p.x + 1, p.y - border / 2 + 1);
        context.lineTo(p.x, p.y - border / 2 + 1);
      },

      () => {
        context.moveTo(p.x + border / 2, p.y + 1);
        context.lineTo(p.x + border / 2, p.y + 1 - border / 2);
        context.lineTo(p.x, p.y + 1 - border / 2);
      },

      () => {
        context.moveTo(p.x + border / 2, p.y + 1);
        context.lineTo(p.x + border / 2, p.y);
      },
    ];

    for (let [diff, op] of zip(surroundings, ops)) {
      if (diff) op();
    }

    context.stroke();
  }

  /** draw a a tetronimo */
  function draw_tetronimo(t: Tetronimo) {
    for (let offset of t.kind.rotations[t.rotation]) {
      let position = Vec.add(t.position, offset);

      let diff = adj8.map(adj =>
        t.kind.rotations[t.rotation]
          .every(v => !Vec.eq(v, Vec.add(offset, adj)))
      );

      if (diff) draw_tile(t.kind, position, diff);
    }
  }

  /** draw a tetronimo in the UI */
  function draw_ui(kinds: TetronimoKind[], center: Vec) {
    let topleft = Vec.add(center, new Vec(-2, -2));
    let botrite = Vec.add(center, new Vec(2, -1 + 3 * kinds.length));

    context.lineCap = 'butt';
    context.lineJoin = 'miter';
    context.strokeStyle = 'gray'
    context.beginPath();

    const thickness = 2 * pixel;
    const length = 8 * pixel;

    context.lineWidth = thickness;

    context.moveTo(topleft.x + thickness / 2, topleft.y + length);
    context.lineTo(topleft.x + thickness / 2, topleft.y + thickness / 2);
    context.lineTo(topleft.x + length, topleft.y + thickness / 2);

    context.moveTo(botrite.x - length, topleft.y + thickness / 2);
    context.lineTo(botrite.x - thickness / 2, topleft.y + thickness / 2);
    context.lineTo(botrite.x - thickness / 2, topleft.y + length);

    context.moveTo(botrite.x - thickness / 2, botrite.y - length);
    context.lineTo(botrite.x - thickness / 2, botrite.y - thickness / 2);
    context.lineTo(botrite.x - length, botrite.y - thickness / 2);

    context.moveTo(topleft.x + length, botrite.y - thickness / 2);
    context.lineTo(topleft.x + thickness / 2, botrite.y - thickness / 2);
    context.lineTo(topleft.x + thickness / 2, botrite.y - length);

    context.stroke();

    for (let kind of kinds) {
      let parts = pieces({ id: -1, kind, position: Vec.zero, rotation: 0 });

      let minX = parts.reduce((m, v) => Math.min(m, v.x), Infinity) + 0.5;
      let minY = parts.reduce((m, v) => Math.min(m, v.y), Infinity) + 0.5;
      let maxX = parts.reduce((m, v) => Math.max(m, v.x), -Infinity) + 0.5;
      let maxY = parts.reduce((m, v) => Math.max(m, v.y), -Infinity) + 0.5;

      let offset = new Vec(-(minX + maxX) / 2, -(minY + maxY) / 2);
      let position = Vec.add(center, offset);

      draw_tetronimo({ id: -1, kind, position, rotation: 0 });

      center = Vec.add(center, new Vec(0, 3));
    }
  }

  requestAnimationFrame(tick);
  function tick() {
    requestAnimationFrame(tick);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();

    context.scale(unit_size, unit_size);
    context.translate(6, 0);

    if (game.holding) {
      context.save();
      if (!game.hold_available)
        context.filter = 'grayscale(100%)';

      draw_ui([game.holding], new Vec(-3, 3));
      context.restore();
    }

    if (rules.bag_preview > 0) {
      draw_ui(game.fall_queue.slice(0, rules.bag_preview), new Vec(rules.field_size.x + 3, 3));
    }

    context.fillStyle = 'white';
    context.fillRect(0, 0, rules.field_size.x, rules.field_size.y);

    context.lineWidth = 1 * pixel;
    context.strokeStyle = '#f4f4f4';
    for (let x = 0; x < rules.field_size.x; ++x) {
      context.beginPath();
      context.moveTo(x + 0.5 * pixel, 0);
      context.lineTo(x + 0.5 * pixel, rules.field_size.y);
      context.moveTo((x + 1) - 0.5 * pixel, 0);
      context.lineTo((x + 1) - 0.5 * pixel, rules.field_size.y);
      context.stroke();
    }

    for (let y = 0; y < rules.field_size.y; ++y) {
      context.beginPath();
      context.moveTo(0, y + 0.5 * pixel);
      context.lineTo(rules.field_size.x, y + 0.5 * pixel);
      context.moveTo(0, (y + 1) - 0.5 * pixel);
      context.lineTo(rules.field_size.x, (y + 1) - 0.5 * pixel);
      context.stroke();
    }

    context.translate(0, -rules.field_size.y / 2);

    if (game.falling) {
      draw_tetronimo(game.falling);

      context.save();
      context.globalAlpha = 0.10;

      let position = runner.drop_position(game.falling);
      draw_tetronimo({ ...game.falling, position });

      context.restore();
    }

    for (let x = 0; x < rules.field_size.x; ++x) {
      for (let y = 0; y < rules.field_size.y; ++y) {
        let t = game.field[y][x];
        if (t == null) continue;

        let position = new Vec(x, y);

        let diff = adj8.map(adj => tile_at(Vec.add(position, adj))?.id != t!.id);

        draw_tile(game.field[y][x]!.kind, new Vec(x, y), diff);
      }
    }

    context.restore();
  }
}
