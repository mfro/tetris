import { Vec } from '@/vec';
import { assert } from '@mfro/ts-common/assert';
import { isContext } from 'vm';

import { TetronimoKind, Tetronimo, pieces, Game } from '..';
import { GameRules, tetronimos } from '../config';

export interface Renderer {
  tile_size: number;
  smoothing: boolean;
  render_tile(context: CanvasRenderingContext2D, kind: TetronimoKind, around: boolean[], style: TileStyle): void;
  render_background(context: CanvasRenderingContext2D, rules: GameRules, origin: Vec): void;
}

export type RenderConfig =
  | { style: 'toon', size: number, smooth: boolean, border: number }
  | { style: 'pixel', size: number, smooth: boolean, border: number, ghost_opacity: number }
  | { style: 'tetrio', ghost_color: boolean };

export async function make_renderer(config: RenderConfig): Promise<Renderer> {
  function default_background(context: CanvasRenderingContext2D, rules: GameRules, origin: Vec, scale: number) {
    function draw_ui(size: number, center: Vec) {
      let topleft = Vec.add(center, new Vec(-2, -2));
      let botrite = Vec.add(center, new Vec(2, -1 + 3 * size));

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
    }

    const pixel = 1 / scale;

    context.save();

    context.scale(scale, scale);
    context.translate(origin.x, origin.y);

    draw_ui(1, new Vec(-3, 3));
    draw_ui(rules.bag_preview, new Vec(rules.field_size.x + 3, 3));

    context.fillStyle = 'white';
    context.fillRect(0, 0, rules.field_size.x, rules.field_size.y / 2);

    context.lineWidth = 1 * pixel;
    context.strokeStyle = '#f4f4f4';
    for (let x = 0; x < rules.field_size.x - 1; ++x) {
      context.beginPath();
      // context.moveTo(x + 0.5 * pixel, 0);
      // context.lineTo(x + 0.5 * pixel, rules.field_size.y);
      context.moveTo((x + 1) - 0.5 * pixel, 0);
      context.lineTo((x + 1) - 0.5 * pixel, rules.field_size.y / 2);
      context.stroke();
    }

    for (let y = 0; y < rules.field_size.y / 2 - 1; ++y) {
      context.beginPath();
      // context.moveTo(0, y + 0.5 * pixel);
      // context.lineTo(rules.field_size.x, y + 0.5 * pixel);
      context.moveTo(0, (y + 1) - 0.5 * pixel);
      context.lineTo(rules.field_size.x, (y + 1) - 0.5 * pixel);
      context.stroke();
    }

    context.translate(0, -rules.field_size.y / 2);

    context.restore();
  }

  if (config.style == 'toon') return {
    tile_size: config.size,
    smoothing: config.smooth,
    render_tile(context, kind, around, style) {
      const colors = new Map([
        [tetronimos.I, '#31c7ef'],
        [tetronimos.O, '#e39f02'],
        [tetronimos.T, '#af298a'],
        [tetronimos.J, '#2141c6'],
        [tetronimos.L, '#e35b02'],
        [tetronimos.S, '#59b101'],
        [tetronimos.Z, '#d70f37'],
        [tetronimos.GARBAGE, 'gray'],
      ]);

      context.save();
      if (style == TileStyle.ghost) {
        context.fillStyle = 'white';
        context.fillRect(0, 0, 1, 1);
      } else if (style == TileStyle.disabled) {
        context.filter = 'grayscale(100%)';
      } else {
        let color = colors.get(kind);
        assert(color != null, `no color for piece`);
        context.fillStyle = color;
        context.fillRect(0, 0, 1, 1);
      }

      const border = config.border / config.size;

      context.beginPath();
      context.lineCap = 'butt';
      context.lineWidth = border;
      context.strokeStyle = '#00000040';

      if (around[0]) {
        context.moveTo(0, border / 2);
        context.lineTo(border / 2, border / 2);
        context.lineTo(border / 2, 0);
      }

      if (around[1]) {
        context.moveTo(0, border / 2);
        context.lineTo(1, border / 2);
      }

      if (around[2]) {
        context.moveTo(1 - border / 2, 0);
        context.lineTo(1 - border / 2, border / 2);
        context.lineTo(1, border / 2);
      }

      if (around[3]) {
        context.moveTo(-border / 2 + 1, 0);
        context.lineTo(-border / 2 + 1, 1);
      }

      if (around[4]) {
        context.moveTo(1, 1 - border / 2);
        context.lineTo(1 - border / 2, 1 - border / 2);
        context.lineTo(1 - border / 2, 1);
      }

      if (around[5]) {
        context.moveTo(1, -border / 2 + 1);
        context.lineTo(0, -border / 2 + 1);
      }

      if (around[6]) {
        context.moveTo(border / 2, 1);
        context.lineTo(border / 2, 1 - border / 2);
        context.lineTo(0, 1 - border / 2);
      }

      if (around[7]) {
        context.moveTo(border / 2, 1);
        context.lineTo(border / 2, 0);
      }

      // context.strokeStyle = kind.color;
      // context.stroke();

      context.strokeStyle = '#00000040';
      context.stroke();

      context.filter = 'none';
      context.restore();
    },
    render_background: (c, r, o) => default_background(c, r, o, config.size),
  };

  if (config.style == 'pixel') return {
    tile_size: config.size,
    smoothing: config.smooth,
    render_tile(context, kind, around, style) {
      const border = config.border / config.size;

      const colors = new Map([
        [tetronimos.I, ['#31c7ef', '#48e0ff', '#20b0e0']],
        [tetronimos.O, ['#f7d308', '#ffec1c', '#e8c000']],
        [tetronimos.T, ['#ad4d9c', '#c658b4', '#983888']],
        [tetronimos.J, ['#5a65ad', '#6680cc', '#4857a0']],
        [tetronimos.L, ['#ef7921', '#ff9030', '#e06810']],
        [tetronimos.S, ['#42b642', '#48d048', '#30a030']],
        [tetronimos.Z, ['#ef2029', '#ff4848', '#d01818']],
        [tetronimos.GARBAGE, ['#42b642', '#48d048', '#30a030']],
        // [tetronimos.GARBAGE, ['#9e9e9e', '#bdbdbd', '#757575']],
      ]);

      let color = colors.get(kind);
      assert(color != null, `no color for piece`);

      context.save();
      if (style == TileStyle.ghost) {
        context.fillStyle = 'white';
        context.fillRect(0, 0, 1, 1);
        context.globalAlpha = config.ghost_opacity;
      }

      if (style == TileStyle.disabled || kind == tetronimos.GARBAGE) {
        context.filter = 'grayscale(100%)';
      }

      context.fillStyle = color[0];
      context.fillRect(border, border, 1 - 2 * border, 1 - 2 * border);

      if (border > 0) {
        context.lineCap = 'butt';
        context.lineJoin = 'miter';
        context.lineWidth = border;

        context.fillStyle = around[7] ? color[1] : color[0];
        context.fillRect(0, border, border, 1 - 2 * border);

        context.fillStyle = around[1] ? color[1] : color[0];
        context.fillRect(border, 0, 1 - 2 * border, border);

        context.fillStyle = around[0] || around[7] || around[1] ? color[1] : color[0];
        context.fillRect(0, 0, border, border);

        context.fillStyle = around[3] ? color[2] : color[0];
        context.fillRect(1 - border, border, border, 1 - 2 * border);

        context.fillStyle = around[5] ? color[2] : color[0];
        context.fillRect(border, 1 - border, 1 - 2 * border, border);

        context.fillStyle = around[4] || around[3] || around[5] ? color[2] : color[0];
        context.fillRect(1 - border, 1 - border, border, border);

        context.fillStyle = around[2] && around[1] && around[3] ? color[0]
          : around[1] ? color[1]
            : around[3] ? color[2]
              : around[2] ? color[2]
                : color[0];
        context.fillRect(0, 1 - border, border, border);

        context.strokeStyle = around[6] && around[7] && around[5] ? color[0]
          : around[7] ? color[1]
            : around[5] ? color[2]
              : around[6] ? color[1]
                : color[0];
        context.fillRect(1 - border, 0, border, border);
      }

      context.filter = 'none';
      context.restore();
    },
    render_background: (c, r, o) => default_background(c, r, o, config.size),
  };

  if (config.style == 'tetrio') {
    const sprites = new Image();
    sprites.src = require('@/assets/tetrio.png');

    const background = new Image();
    background.src = require('@/assets/tetrio-bg.png');

    const order = [
      tetronimos.Z,
      tetronimos.L,
      tetronimos.O,
      tetronimos.S,
      tetronimos.I,
      tetronimos.J,
      tetronimos.T,
    ];

    let p1 = new Promise(resolve => sprites.onload = resolve);
    let p2 = new Promise(resolve => background.onload = resolve);
    await p1;
    await p2;

    return {
      tile_size: 30,
      smoothing: false,
      render_tile(context, kind, around, style) {
        context.save();

        let index;
        if (style == TileStyle.disabled || kind == tetronimos.GARBAGE) {
          index = 9;
        } else {
          index = order.indexOf(kind);
        }

        if (style == TileStyle.ghost) {
          context.globalAlpha = 0.2;
          context.drawImage(sprites, 7 * 31, 0, 30, 30, 0, 0, 1, 1);
          if (config.ghost_color) {
            context.globalAlpha = 1;
            context.globalCompositeOperation = 'source-atop';
            context.drawImage(sprites, index * 31, 0, 30, 30, 0, 0, 1, 1);
          }
        } else {
          context.drawImage(sprites, index * 31, 0, 30, 30, 0, 0, 1, 1);
        }

        context.restore();
      },
      render_background(context, rules, origin) {
        function draw_ui(size: number, center: Vec) {
          context.fillStyle = '#000000e0';
          context.fillRect(center.x - 2, center.y - 2, 4, 1 + 3 * size);

          const thickness = 0.125;
          context.strokeStyle = '#ffffffe0';
          context.lineJoin = 'round';
          context.lineWidth = thickness;
          context.strokeRect(center.x - 2 - thickness / 2, center.y - 2 - thickness / 2, 4 + thickness, 1 + 3 * size + thickness);
        }

        const pixel = 1 / 30;

        context.save();

        context.drawImage(background, 0, 0, 2000, 1333, 30 * (origin.x + rules.field_size.x / 2) - 1000, 0, 2000, 1333);

        context.fillStyle = '#000000a0';
        context.fillRect(0, 0, 2000, 1333);

        context.scale(30, 30);
        context.translate(origin.x, origin.y);

        const thickness = 0.125;
        context.strokeStyle = '#ffffffe0';
        context.lineCap = 'butt';
        context.lineJoin = 'round';
        context.lineWidth = thickness;
        context.beginPath();
        context.moveTo(0, thickness / 2);
        context.lineTo(-thickness / 2, thickness / 2);
        context.lineTo(-thickness / 2, rules.field_size.y / 2 + thickness / 2);
        context.lineTo(rules.field_size.x + thickness / 2, rules.field_size.y / 2 + thickness / 2);
        context.lineTo(rules.field_size.x + thickness / 2, thickness / 2);
        context.lineTo(rules.field_size.x, thickness / 2);
        context.stroke();

        draw_ui(1, new Vec(-3, 3));
        draw_ui(rules.bag_preview, new Vec(rules.field_size.x + 3, 3));

        context.fillStyle = '#000000e0';
        context.fillRect(0, 0, rules.field_size.x, rules.field_size.y / 2);

        context.lineWidth = 1 * pixel;
        context.strokeStyle = '#ffffff14';
        for (let x = 0; x < rules.field_size.x - 1; ++x) {
          context.beginPath();
          // context.moveTo(x + 0.5 * pixel, 0);
          // context.lineTo(x + 0.5 * pixel, rules.field_size.y);
          context.moveTo((x + 1) - 0.5 * pixel, 0);
          context.lineTo((x + 1) - 0.5 * pixel, rules.field_size.y / 2);
          context.stroke();
        }

        for (let y = 0; y < rules.field_size.y / 2 - 1; ++y) {
          context.beginPath();
          // context.moveTo(0, y + 0.5 * pixel);
          // context.lineTo(rules.field_size.x, y + 0.5 * pixel);
          context.moveTo(0, (y + 1) - 0.5 * pixel);
          context.lineTo(rules.field_size.x, (y + 1) - 0.5 * pixel);
          context.stroke();
        }

        context.translate(0, -rules.field_size.y / 2);

        context.restore();
      },
    };
  }

  throw new Error('invalid render config');
}

export enum TileStyle {
  normal,
  ghost,
  disabled,
}

interface ImageCache {
  hash: string;
  images: string[];
}

export async function render_tilesheets(config: RenderConfig) {
  const renderer = await make_renderer(config);
  const styles = [TileStyle.normal, TileStyle.ghost, TileStyle.disabled];

  const canvas = document.createElement('canvas');

  let offset_fn: (around: number, style: TileStyle) => Vec;
  if (renderer.smoothing) {
    const IMAGE_STRIDE = 256;

    canvas.width = renderer.tile_size * IMAGE_STRIDE;
    canvas.height = renderer.tile_size * styles.length * (256 / IMAGE_STRIDE);

    offset_fn = (around, style) => {
      let index = (around) | (style << 8);
      return new Vec(index % IMAGE_STRIDE, Math.floor(index / IMAGE_STRIDE));
    };
  } else {
    canvas.width = renderer.tile_size * styles.length;
    canvas.height = renderer.tile_size;

    offset_fn = (around, style) => new Vec(style, 0);
  }

  const lookup = (around: boolean[], style: TileStyle) => {
    let index = 0;

    for (let i = 0; i < 8; ++i) {
      if (around[i]) {
        index |= (1 << i);
      }
    }

    return Vec.scale(offset_fn(index, style), renderer.tile_size);
  };

  let bytes = new TextEncoder().encode(JSON.stringify(config) + renderer.render_tile.toString());
  let hash_raw = await window.crypto.subtle.digest('SHA-256', bytes);
  let hash = Array.from(new Uint8Array(hash_raw))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');

  let raw = localStorage.getItem('mfro:tetris-tilesheet');
  if (raw) {
    let cache: ImageCache = JSON.parse(raw);
    if (cache.hash == hash) {
      // console.log(`tilesheet hash match ${hash}`);
      return [lookup, cache.images] as const;
    } else {
      console.log(`tilesheet cache miss ${cache.hash} expected ${hash}`);
    }
  }

  const context = canvas.getContext('2d');
  assert(context != null, 'no context');

  context.scale(renderer.tile_size, renderer.tile_size);

  let images = [];
  let kinds = [...tetronimos.all, tetronimos.GARBAGE];
  for (let kind of kinds) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let style of styles) {
      if (renderer.smoothing) {
        for (let i = 0; i < 256; ++i) {
          let around = [];
          for (let j = 0; j < 8; ++j) around[j] = (i & (1 << j)) != 0;

          let offset = offset_fn(i, style);
          context.translate(offset.x, offset.y);
          renderer.render_tile(context, kind, around, style);
          context.translate(-offset.x, -offset.y);
        }
      } else {
        let around = [true, true, true, true, true, true, true, true];
        let offset = offset_fn(0, style);
        context.translate(offset.x, offset.y);
        renderer.render_tile(context, kind, around, style);
        context.translate(-offset.x, -offset.y);
      }
    }

    let url = canvas.toDataURL();
    images.push(url);
    // console.log(url);
  }

  if (images.length == kinds.length) {
    localStorage.setItem('mfro:tetris-tilesheet', JSON.stringify({ hash, images }))
  }

  return [lookup, images] as const;
}

async function prerender(config: RenderConfig): Promise<Renderer> {
  let base = await make_renderer(config);
  let [lookup, data] = await render_tilesheets(config);

  let images = data.map(url => {
    let image = new Image();
    image.src = url;
    return image;
  });

  return {
    ...base,
    render_tile(context, kind, around, style) {
      let sheet = images[kind == tetronimos.GARBAGE ? tetronimos.all.length : tetronimos.all.indexOf(kind)];
      let offset = lookup(around, style);

      context.drawImage(sheet, offset.x, offset.y, base.tile_size, base.tile_size, 0, 0, 1, 1)
    },
  };
}

export async function render(canvas: HTMLCanvasElement, config: RenderConfig, game: Game) {
  const renderer = await prerender(config);

  const unit_size = renderer.tile_size;

  canvas.width = (game.rules.field_size.x + 14) * unit_size;
  canvas.height = (game.rules.field_size.y / 2) * unit_size + 2;
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

      context.translate(position.x, position.y);
      renderer.render_tile(context, t.kind, diff, style);
      context.translate(-position.x, -position.y);
    }
  }

  /** draw a tetronimo in the UI */
  function draw_ui(kinds: TetronimoKind[], center: Vec, hold = false) {
    for (let kind of kinds) {
      let parts = pieces({ id: -1, kind, position: Vec.zero, rotation: 0 });

      let minX = parts.reduce((m, v) => Math.min(m, v.x), Infinity) + 0.5;
      let minY = parts.reduce((m, v) => Math.min(m, v.y), Infinity) + 0.5;
      let maxX = parts.reduce((m, v) => Math.max(m, v.x), -Infinity) + 0.5;
      let maxY = parts.reduce((m, v) => Math.max(m, v.y), -Infinity) + 0.5;

      let offset = new Vec(-(minX + maxX) / 2, -(minY + maxY) / 2);
      let position = Vec.add(center, offset);

      let style = hold && !game.state.hold_available ? TileStyle.disabled : TileStyle.normal;
      draw_tetronimo({ id: -1, kind, position, rotation: 0 }, style);

      center = Vec.add(center, new Vec(0, 3));
    }
  }

  let cancel = requestAnimationFrame(tick);
  function tick() {
    cancel = requestAnimationFrame(tick);

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.save();

    renderer.render_background(context, game.rules, new Vec(7, 1));

    context.scale(renderer.tile_size, renderer.tile_size);
    context.translate(7, 1);

    if (game.state.holding) {
      draw_ui([game.state.holding], new Vec(-3, 3), true);
    }

    if (game.rules.bag_preview > 0) {
      draw_ui(game.state.fall_queue.slice(0, game.rules.bag_preview), new Vec(game.rules.field_size.x + 3, 3));
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

        context.translate(x, y);
        renderer.render_tile(context, game.state.field[y][x]!.kind, diff, TileStyle.normal);
        context.translate(-x, -y);
      }
    }

    context.restore();
  }

  return () => cancelAnimationFrame(cancel);
}
