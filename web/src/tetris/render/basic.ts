import { Vec } from '@/vec';
import { assert } from '@mfro/ts-common/assert';

import { TetronimoKind, Tetronimo, pieces, Game } from '..';
import { tetronimos } from '../config';

/** draw a single tile of a tetronimo */
export const draw_styles = {
  v1(context: CanvasRenderingContext2D, position: Vec, kind: TetronimoKind, surroundings: boolean[], style: TileStyle) {
    const colors = new Map([
      [tetronimos.I, '#31c7ef'],
      [tetronimos.O, '#e39f02'],
      [tetronimos.T, '#af298a'],
      [tetronimos.J, '#2141c6'],
      [tetronimos.L, '#e35b02'],
      [tetronimos.S, '#59b101'],
      [tetronimos.Z, '#d70f37'],
    ]);

    const p = position;

    context.save();
    if (style == TileStyle.ghost) {
      context.fillStyle = 'white';
      context.fillRect(p.x, p.y, 1, 1);
    } else if (style == TileStyle.disabled) {
      context.filter = 'grayscale(100%)';
    } else {
      let color = colors.get(kind);
      assert(color != null, `no color for piece`);
      context.fillStyle = color;
      context.fillRect(p.x, p.y, 1, 1);
    }

    const border = 1 / 8;

    context.beginPath();
    context.lineCap = 'butt';
    context.lineWidth = border;
    context.strokeStyle = '#00000040';

    if (surroundings[0]) {
      context.moveTo(p.x, p.y + border / 2);
      context.lineTo(p.x + border / 2, p.y + border / 2);
      context.lineTo(p.x + border / 2, p.y);
    }

    if (surroundings[1]) {
      context.moveTo(p.x, p.y + border / 2);
      context.lineTo(p.x + 1, p.y + border / 2);
    }

    if (surroundings[2]) {
      context.moveTo(p.x + 1 - border / 2, p.y);
      context.lineTo(p.x + 1 - border / 2, p.y + border / 2);
      context.lineTo(p.x + 1, p.y + border / 2);
    }

    if (surroundings[3]) {
      context.moveTo(p.x - border / 2 + 1, p.y);
      context.lineTo(p.x - border / 2 + 1, p.y + 1);
    }

    if (surroundings[4]) {
      context.moveTo(p.x + 1, p.y + 1 - border / 2);
      context.lineTo(p.x + 1 - border / 2, p.y + 1 - border / 2);
      context.lineTo(p.x + 1 - border / 2, p.y + 1);
    }

    if (surroundings[5]) {
      context.moveTo(p.x + 1, p.y - border / 2 + 1);
      context.lineTo(p.x, p.y - border / 2 + 1);
    }

    if (surroundings[6]) {
      context.moveTo(p.x + border / 2, p.y + 1);
      context.lineTo(p.x + border / 2, p.y + 1 - border / 2);
      context.lineTo(p.x, p.y + 1 - border / 2);
    }

    if (surroundings[7]) {
      context.moveTo(p.x + border / 2, p.y + 1);
      context.lineTo(p.x + border / 2, p.y);
    }

    // context.strokeStyle = kind.color;
    // context.stroke();

    context.strokeStyle = '#00000040';
    context.stroke();

    context.filter = 'none';
    context.restore();
  },

  v2(context: CanvasRenderingContext2D, position: Vec, kind: TetronimoKind, surroundings: boolean[], style: TileStyle) {
    const border = 1 / 8;

    const colors = new Map([
      [tetronimos.I, ['#31c7ef', '#48e0ff', '#20b0e0']],
      [tetronimos.O, ['#f7d308', '#ffec1c', '#e8c000']],
      [tetronimos.T, ['#ad4d9c', '#c658b4', '#983888']],
      [tetronimos.J, ['#5a65ad', '#6680cc', '#4857a0']],
      [tetronimos.L, ['#ef7921', '#ff9030', '#e06810']],
      [tetronimos.S, ['#42b642', '#48d048', '#30a030']],
      [tetronimos.Z, ['#ef2029', '#ff4848', '#d01818']],
    ]);

    const p = position;

    let color = colors.get(kind);
    assert(color != null, `no color for piece`);

    context.save();
    if (style == TileStyle.ghost) {
      context.fillStyle = 'white';
      context.fillRect(p.x, p.y, 1, 1);
      context.globalAlpha = 0.4;
    } else if (style == TileStyle.disabled) {
      context.filter = 'grayscale(100%)';
    }

    context.translate(p.x, p.y);

    const left_inner = border;
    const left_outer = border / 2;
    const right_inner = 1 - border;
    const right_outer = 1 - border / 2;

    context.fillStyle = color[0];
    context.fillRect(left_inner, left_inner, 1 - 2 * border, 1 - 2 * border);

    context.lineCap = 'butt';
    context.lineWidth = border;

    context.beginPath();
    context.moveTo(left_outer, right_inner);
    context.lineTo(left_outer, left_inner);
    context.strokeStyle = surroundings[7] ? color[1] : color[0];
    context.stroke();

    context.beginPath();
    context.moveTo(left_inner, left_outer);
    context.lineTo(right_inner, left_outer);
    context.strokeStyle = surroundings[1] ? color[1] : color[0];
    context.stroke();

    context.beginPath();
    context.moveTo(0, left_outer);
    context.lineTo(left_outer, left_outer);
    context.lineTo(left_outer, 0);
    context.strokeStyle = surroundings[0] || surroundings[7] || surroundings[1] ? color[1] : color[0];
    context.stroke();

    context.beginPath();
    context.moveTo(right_outer, left_inner);
    context.lineTo(right_outer, right_inner);
    context.strokeStyle = surroundings[3] ? color[2] : color[0];
    context.stroke();

    context.beginPath();
    context.moveTo(right_inner, right_outer);
    context.lineTo(left_inner, right_outer);
    context.strokeStyle = surroundings[5] ? color[2] : color[0];
    context.stroke();

    context.beginPath();
    context.moveTo(1, right_outer);
    context.lineTo(right_outer, right_outer);
    context.lineTo(right_outer, 1);
    context.strokeStyle = surroundings[4] || surroundings[3] || surroundings[5] ? color[2] : color[0];
    context.stroke();

    context.beginPath();
    context.moveTo(right_outer, 0);
    context.lineTo(right_outer, left_outer);
    context.lineTo(1, left_outer);
    context.strokeStyle = surroundings[2] && surroundings[1] && surroundings[3] ? color[0]
      : surroundings[1] ? color[1]
        : surroundings[3] ? color[2]
          : surroundings[2] ? color[2]
            : color[0];
    context.stroke();

    context.beginPath();
    context.moveTo(left_outer, 1);
    context.lineTo(left_outer, right_outer);
    context.lineTo(0, right_outer);
    context.strokeStyle = surroundings[6] && surroundings[7] && surroundings[5] ? color[0]
      : surroundings[7] ? color[1]
        : surroundings[5] ? color[2]
          : surroundings[6] ? color[1]
            : color[0];
    context.stroke();

    context.filter = 'none';
    context.restore();
  },
};

export enum TileStyle {
  normal,
  ghost,
  disabled,
}

const IMAGE_STRIDE = 256;
export function image_offset(around: boolean[], style: TileStyle, size: number) {
  let index = style << 8;

  for (let i = 0; i < 8; ++i) {
    if (around[i]) {
      index |= (1 << i);
    }
  }

  // return Vec.scale(new Vec(x, style), size);
  return Vec.scale(new Vec(index % IMAGE_STRIDE, Math.floor(index / IMAGE_STRIDE)), size);
}

interface ImageCache {
  hash: string;
  list: string[];
}

export function render_tilesheets(size: number, render: (context: CanvasRenderingContext2D, position: Vec, kind: TetronimoKind, around: boolean[], style: TileStyle) => void, callback: (s: string[]) => void) {
  let bytes = new TextEncoder().encode(render.toString());
  window.crypto.subtle.digest('SHA-256', bytes).then(hash_raw => {
    let hash = Array.from(new Uint8Array(hash_raw))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    let raw = localStorage.getItem('mfro:tetris-tilesheet');
    if (raw) {
      let cache: ImageCache = JSON.parse(raw);
      if (cache.hash == hash) {
        // console.log(`tilesheet hash match ${hash}`);
        callback(cache.list);
        return;
      } else {
        console.log(`tilesheet hash match ${cache.hash} expected ${hash}`);
      }
    }

    const styles = [TileStyle.normal, TileStyle.ghost, TileStyle.disabled];

    let canvas = document.createElement('canvas');
    canvas.width = size * IMAGE_STRIDE;
    canvas.height = size * styles.length * (256 / IMAGE_STRIDE);

    let context = canvas.getContext('2d');
    assert(context != null, 'no context');

    context.scale(size, size);

    let list: string[] = [];

    for (let kind of tetronimos.all) {
      context!.clearRect(0, 0, canvas.width, canvas.height);

      for (let style of styles) {
        for (let i = 0; i < 256; ++i) {
          let around = [];
          for (let j = 0; j < 8; ++j) around[j] = (i & (1 << j)) != 0;

          let offset = image_offset(around, style, 1);
          render(context!, offset, kind, around, style);
        }
      }

      let url = canvas.toDataURL();
      list.push(url);
      if (list.length == tetronimos.all.length) {
        localStorage.setItem('mfro:tetris-tilesheet', JSON.stringify({ hash, list }))
        callback(list);
      }
    }
  });
}

function prerender(size: number, render: (context: CanvasRenderingContext2D, position: Vec, kind: TetronimoKind, around: boolean[], style: TileStyle) => void) {
  let images: HTMLImageElement[] = [];
  // let images = render_tilesheets(size, render).map(s => {
  //   let image = new Image();
  //   image.src = s;
  //   return image;
  // });

  return (context: CanvasRenderingContext2D, position: Vec, kind: TetronimoKind, around: boolean[], style: TileStyle) => {
    let sheet = images[tetronimos.all.indexOf(kind)];
    let offset = image_offset(around, style, size);

    context.drawImage(sheet, offset.x, offset.y, size, size, position.x, position.y, 1, 1)
  };
}

export function render(canvas: HTMLCanvasElement, game: Game) {
  const unit_size = 32;
  const pixel = 1 / unit_size;

  // const render_tile = draw_tile.v2;
  const render_tile = prerender(unit_size, draw_styles.v2);

  canvas.width = (game.rules.field_size.x + 12) * unit_size;
  canvas.height = (game.rules.field_size.y / 2) * unit_size;
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;

  const context = canvas.getContext('2d')!;
  assert(context != null, 'no context');

  context.imageSmoothingEnabled = false;

  function tile_at(pos: Vec) {
    if (pos.x < 0 || pos.x >= game.rules.field_size.x
      || pos.y < 0 || pos.y >= game.rules.field_size.y)
      return null;

    return game.state.field[pos.y][pos.x];
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

  /** draw a a tetronimo */
  function draw_tetronimo(t: Tetronimo, style: TileStyle) {
    for (let offset of t.kind.rotations[t.rotation]) {
      let position = Vec.add(t.position, offset);

      let diff = adj8.map(adj =>
        t.kind.rotations[t.rotation]
          .every(v => !Vec.eq(v, Vec.add(offset, adj)))
      );

      render_tile(context, position, t.kind, diff, style);
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

      draw_tetronimo({ id: -1, kind, position, rotation: 0 }, TileStyle.normal);

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

    if (game.state.holding) {
      context.save();
      draw_ui([game.state.holding], new Vec(-3, 3));
      context.restore();
    }

    if (game.rules.bag_preview > 0) {
      draw_ui(game.state.fall_queue.slice(0, game.rules.bag_preview), new Vec(game.rules.field_size.x + 3, 3));
    }

    context.fillStyle = 'white';
    context.fillRect(0, 0, game.rules.field_size.x, game.rules.field_size.y);

    context.lineWidth = 1 * pixel;
    context.strokeStyle = '#f4f4f4';
    for (let x = 0; x < game.rules.field_size.x; ++x) {
      context.beginPath();
      context.moveTo(x + 0.5 * pixel, 0);
      context.lineTo(x + 0.5 * pixel, game.rules.field_size.y);
      context.moveTo((x + 1) - 0.5 * pixel, 0);
      context.lineTo((x + 1) - 0.5 * pixel, game.rules.field_size.y);
      context.stroke();
    }

    for (let y = 0; y < game.rules.field_size.y; ++y) {
      context.beginPath();
      context.moveTo(0, y + 0.5 * pixel);
      context.lineTo(game.rules.field_size.x, y + 0.5 * pixel);
      context.moveTo(0, (y + 1) - 0.5 * pixel);
      context.lineTo(game.rules.field_size.x, (y + 1) - 0.5 * pixel);
      context.stroke();
    }

    context.translate(0, -game.rules.field_size.y / 2);

    if (game.state.falling) {
      let position = game.hard_drop_position(game.state.falling);
      draw_tetronimo({ ...game.state.falling, position }, TileStyle.ghost);

      draw_tetronimo(game.state.falling, TileStyle.normal);
    }

    for (let x = 0; x < game.rules.field_size.x; ++x) {
      for (let y = 0; y < game.rules.field_size.y; ++y) {
        let t = game.state.field[y][x];
        if (t == null) continue;

        let position = new Vec(x, y);

        let diff = adj8.map(adj => tile_at(Vec.add(position, adj))?.id != t!.id);

        render_tile(context, new Vec(x, y), game.state.field[y][x]!.kind, diff, TileStyle.normal);
      }
    }

    context.restore();
  }
}
