import { Application, BaseTexture, Container, Graphics, Point, Rectangle, Sprite, Texture } from 'pixi.js';
import { watch, watchEffect } from 'vue';

import { Vec } from '@/vec';

import { TetronimoKind, Game, Tetronimo, pieces } from '..';
import { tetronimos } from '../config';

import { draw_styles, image_offset, render_tilesheets, TileStyle } from './basic';

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

export function render(canvas: HTMLCanvasElement, game: Game) {
  const unit_size = 32;
  const pixel = 1 / unit_size;

  const textures = new Map<TetronimoKind, BaseTexture>();

  canvas.width = (game.rules.field_size.x + 12) * unit_size;
  canvas.height = (game.rules.field_size.y / 2) * unit_size;
  canvas.style.width = `${canvas.width}px`;
  canvas.style.height = `${canvas.height}px`;

  function tile_at(pos: Vec) {
    if (pos.x < 0 || pos.x >= game.rules.field_size.x
      || pos.y < 0 || pos.y >= game.rules.field_size.y)
      return null;

    return game.state.field[pos.y][pos.x];
  }

  function draw_tile(position: Vec, kind: TetronimoKind, around: boolean[], style: TileStyle) {
    let base = textures.get(kind)!;
    let index = image_offset(around, style, unit_size);

    let sprite = new Sprite();
    sprite.scale = new Point(1 / unit_size, 1 / unit_size);
    sprite.texture = new Texture(base, new Rectangle(index.x, index.y, unit_size, unit_size));
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

    draw_tetronimo(t: Tetronimo, style: TileStyle) {
      let offsets = t.kind.rotations[t.rotation];

      for (let offset of t.kind.rotations[t.rotation]) {
        let position = Vec.add(t.position, offset);

        let around = adj8.map(adj =>
          offsets
            .every(v => !Vec.eq(v, Vec.add(offset, adj)))
        );

        let sprite = draw_tile(position, t.kind, around, style);
        this.sprites.push(sprite);
        this.container.addChild(sprite);
      }
    }
  }

  function draw_ui(src: () => (TetronimoKind | null)[]) {
    let size = src().length;

    let field = new Container();
    // field.scale = new Point(1, unit_size);

    let g = new Graphics();
    field.addChild(g);
    g.scale = new Point(1 / unit_size, 1 / unit_size);

    let topleft = Vec.scale(new Vec(0, 0), unit_size);
    let botrite = Vec.scale(new Vec(4, 1 + 3 * size), unit_size);

    const thickness = 2;
    const length = 8;

    g.lineStyle(thickness, 0x808080, 1, 0);

    g.moveTo(topleft.x, topleft.y + length);
    g.lineTo(topleft.x, topleft.y);
    g.lineTo(topleft.x + length, topleft.y);

    g.moveTo(botrite.x - length, topleft.y);
    g.lineTo(botrite.x, topleft.y);
    g.lineTo(botrite.x, topleft.y + length);

    g.moveTo(botrite.x, botrite.y - length);
    g.lineTo(botrite.x, botrite.y);
    g.lineTo(botrite.x - length, botrite.y);

    g.moveTo(topleft.x + length, botrite.y);
    g.lineTo(topleft.x, botrite.y);
    g.lineTo(topleft.x, botrite.y - length);

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

        let style = list.length == 1 && !hold_available ? TileStyle.disabled : TileStyle.normal;

        pool.draw_tetronimo({ id: -1, kind, position, rotation: 0 }, style);
        center = Vec.add(center, new Vec(0, 3));
      }
    }, { immediate: true });

    return field;
  }

  function draw_background(g: Graphics) {
    g.beginFill(0xFFFFFF);
    g.drawRect(0, 0, game.rules.field_size.x, game.rules.field_size.y);
    g.endFill();

    g.lineStyle(pixel, 0xf4f4f4);
    for (let x = 0; x < game.rules.field_size.x; ++x) {
      g.moveTo(x + 0.5 * pixel, 0);
      g.lineTo(x + 0.5 * pixel, game.rules.field_size.y);
      g.moveTo((x + 1) - 0.5 * pixel, 0);
      g.lineTo((x + 1) - 0.5 * pixel, game.rules.field_size.y);
    }

    for (let y = 0; y < game.rules.field_size.y; ++y) {
      g.moveTo(0, y + 0.5 * pixel);
      g.lineTo(game.rules.field_size.x, y + 0.5 * pixel);
      g.moveTo(0, (y + 1) - 0.5 * pixel);
      g.lineTo(game.rules.field_size.x, (y + 1) - 0.5 * pixel);
    }
  }

  const app = new Application({
    view: canvas,
    width: unit_size * (game.rules.field_size.x + 12),
    height: unit_size * (game.rules.field_size.y / 2),
    transparent: true,
  });

  let s = performance.now();
  render_tilesheets(unit_size, draw_styles.v2, tilesheets => {
    let e = performance.now();
    console.log(e - s);
    tilesheets.forEach((sheet, i) => {
      app.loader.add(i.toString(), sheet);
    });
    app.loader.load();
  });

  app.loader.onLoad.once(() => {
    for (let i = 0; i < 7; ++i) {
      let base = app.loader.resources[i]!.texture.baseTexture;
      textures.set(tetronimos.all[i], base);
    }

    const root = new Container();
    root.scale = new Point(unit_size, unit_size);

    const field = new Container();
    field.position = new Point(6, (-game.rules.field_size.y / 2));

    const background = new Graphics();
    draw_background(background);

    const holding = draw_ui(() => [game.state.holding]);
    holding.position = new Point(1, 1);

    const queue = draw_ui(() => game.state.fall_queue.slice(0, 5));
    queue.position = new Point((7 + game.rules.field_size.x), 1);

    field.addChild(background);
    root.addChild(field);
    root.addChild(queue);
    root.addChild(holding);
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
  });

  return () => app.destroy();
}
