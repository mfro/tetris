import { Application, BaseTexture, Container, Graphics, Point, Rectangle, SCALE_MODES, settings as pixi_settings, Sprite, Texture } from 'pixi.js';
import { watch, watchEffect } from 'vue';

import { Vec } from '@/vec';

import { TetronimoKind, Game, Tetronimo, pieces } from '..';
import { GameRules, tetronimos } from '../config';

import { make_renderer, RenderConfig, Renderer, render_tilesheets, TileStyle } from './basic';
import { assert } from '@mfro/ts-common/assert';
import { SSL_OP_TLS_BLOCK_PADDING_BUG } from 'constants';

const padding = new Vec(3, 3);

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

function prerender_background(renderer: Renderer, rules: GameRules) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  assert(context != null, 'context');

  canvas.width = renderer.tile_size * (rules.field_size.x + 12 + padding.x * 2);
  canvas.height = renderer.tile_size * (rules.field_size.y / 2 + padding.y * 2);

  renderer.render_background(context, rules, Vec.add(padding, new Vec(6, 0)));

  return canvas.toDataURL();
}

export async function render(canvas: HTMLCanvasElement, config: RenderConfig, game: Game) {
  const renderer = await make_renderer(config);

  const unit_size = renderer.tile_size;

  const textures = new Map<TetronimoKind, BaseTexture>();

  canvas.width = (game.rules.field_size.x + 12 + padding.x * 2) * unit_size;
  canvas.height = (game.rules.field_size.y / 2 + padding.y * 2) * unit_size;
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;
  canvas.style.marginBottom = `${-padding.y * unit_size}px`;

  pixi_settings.SCALE_MODE = SCALE_MODES.NEAREST;

  function tile_at(pos: Vec) {
    if (pos.x < 0 || pos.x >= game.rules.field_size.x
      || pos.y < 0 || pos.y >= game.rules.field_size.y)
      return null;

    return game.state.field[pos.y][pos.x];
  }

  function draw_tile(position: Vec, kind: TetronimoKind, around: boolean[], style: TileStyle) {
    let base = textures.get(kind)!;
    let index = lookup(around, style);

    let sprite = new Sprite();
    sprite.scale = new Point(1 / renderer.tile_size, 1 / renderer.tile_size);
    sprite.texture = new Texture(base, new Rectangle(index.x, index.y, renderer.tile_size, renderer.tile_size));
    sprite.position = new Point(position.x, position.y);

    return sprite;
  }

  class SpritePool {
    sprites: Sprite[] = [];

    constructor(
      readonly container: Container,
    ) { }

    clear() {
      for (let sprite of this.sprites)
        this.container.removeChild(sprite);
      this.sprites = [];
    }

    draw_tile(position: Vec, kind: TetronimoKind, around: boolean[], style: TileStyle) {
      let sprite = draw_tile(position, kind, around, style);
      this.sprites.push(sprite);
      this.container.addChild(sprite);
    }

    draw_tetronimo(t: Tetronimo, style: TileStyle) {
      let offsets = t.kind.rotations[t.rotation];

      for (let offset of t.kind.rotations[t.rotation]) {
        let position = Vec.add(t.position, offset);

        let around = adj8.map(adj =>
          offsets
            .every(v => !Vec.eq(v, Vec.add(offset, adj)))
        );

        this.draw_tile(position, t.kind, around, style);
      }
    }
  }

  function draw_ui(src: () => (TetronimoKind | null)[], isHold: boolean) {
    let field = new Container();
    let pool = new SpritePool(field);
    watch(() => [src(), game.state.hold_available] as const, ([list, hold_available]) => {
      pool.clear();

      let center = new Vec(2, 2);

      for (let kind of list) {
        if (!kind) continue;

        let parts = pieces({ id: -1, kind, position: Vec.zero, rotation: 0 });

        let minX = parts.reduce((m, v) => Math.min(m, v.x), Infinity) + 0.5;
        let minY = parts.reduce((m, v) => Math.min(m, v.y), Infinity) + 0.5;
        let maxX = parts.reduce((m, v) => Math.max(m, v.x), -Infinity) + 0.5;
        let maxY = parts.reduce((m, v) => Math.max(m, v.y), -Infinity) + 0.5;

        let offset = new Vec(-(minX + maxX) / 2, -(minY + maxY) / 2);
        let position = Vec.add(center, offset);

        let style = isHold && !hold_available ? TileStyle.disabled : TileStyle.normal;

        pool.draw_tetronimo({ id: -1, kind, position, rotation: 0 }, style);
        center = Vec.add(center, new Vec(0, 3));
      }
    }, { immediate: true });

    return field;
  }

  const app = new Application({
    view: canvas,
    width: unit_size * (game.rules.field_size.x + 12 + padding.x * 2),
    height: unit_size * (game.rules.field_size.y / 2 + padding.y * 2),
    transparent: true,
  });

  let [lookup, tilesheets] = await render_tilesheets(config);
  tilesheets.forEach((sheet, i) => {
    app.loader.add(i.toString(), sheet);
  });
  app.loader.add('background', prerender_background(renderer, game.rules));
  app.loader.load();

  app.loader.onLoad.once(() => {
    for (let i = 0; i < 7; ++i) {
      let base = app.loader.resources[i]!.texture.baseTexture;
      textures.set(tetronimos.all[i], base);
    }
    let base = app.loader.resources[tetronimos.all.length]!.texture.baseTexture;
    textures.set(tetronimos.GARBAGE, base);

    const root = new Container();
    root.scale = new Point(unit_size, unit_size);

    const field = new Container();
    field.position = new Point(6 + padding.x, (-game.rules.field_size.y / 2) + padding.y);

    const background = new Sprite(app.loader.resources['background'].texture);
    background.width = game.rules.field_size.x + 12 + padding.x * 2;
    background.height = game.rules.field_size.y / 2 + padding.y * 2;

    const holding = draw_ui(() => [game.state.holding], true);
    holding.position = new Point(1 + padding.x, 1 + padding.y);

    const queue = draw_ui(() => game.state.fall_queue.slice(0, 5), false);
    queue.position = new Point((7 + padding.x + game.rules.field_size.x), 1 + padding.y);

    const garbage = new Container();
    garbage.position = new Point(4 + padding.x, padding.y);

    root.addChild(background);
    root.addChild(field);
    root.addChild(queue);
    root.addChild(holding);
    root.addChild(garbage);
    app.stage.addChild(root);

    for (let x = 0; x < game.rules.field_size.x; ++x) {
      for (let y = 0; y < game.rules.field_size.y; ++y) {
        let position = new Vec(x, y);
        let sprite: Sprite | null = null;

        watchEffect(() => {
          if (sprite != null) {
            field.removeChild(sprite);
            sprite = null;
          }

          let t = game.state.field[y][x];
          if (t != null) {
            let around = adj8.map(adj => tile_at(Vec.add(position, adj))?.id != t!.id);
            sprite = draw_tile(new Vec(x, y), t.kind, around, TileStyle.normal);
            field.addChild(sprite);
          }
        });
      }
    }

    let falling = new SpritePool(field);
    watchEffect(() => {
      falling.clear();

      if (game.state.falling) {
        let position = game.hard_drop_position(game.state.falling);
        let ghost = { ...game.state.falling, position };
        falling.draw_tetronimo(ghost, TileStyle.ghost);
        falling.draw_tetronimo(game.state.falling, TileStyle.normal);
      }
    });

    let garbage_pool = new SpritePool(garbage);
    watchEffect(() => {
      garbage_pool.clear();
      let y = game.rules.field_size.y / 2;

      for (let count of game.state.garbage_ready) {
        y -= count;
        for (let i = 0; i < count; ++i) {
          let position = new Vec(0, y + i);
          garbage_pool.draw_tile(position, tetronimos.GARBAGE, [true, i == 0, true, true, true, i + 1 == count, true, true], TileStyle.normal);
        }
      }

      for (let count of game.state.garbage_pending) {
        y -= count;
        for (let i = 0; i < count; ++i) {
          let position = new Vec(0, y + i);
          garbage_pool.draw_tile(position, tetronimos.GARBAGE, [true, i == 0, true, true, true, i + 1 == count, true, true], TileStyle.ghost);
        }
      }
    });
  });

  return () => app.destroy();
}
