<template>
  <v-app align-center class="pa-6">
    <v-dialog :model-value="editing != null">
      <v-card style="min-width: 60ch">
        <template v-slot:title>
          <v-text title v-if="editing == 'game'">Game Rules</v-text>
          <v-text title v-if="editing == 'user'">User Config</v-text>

          <v-grow />

          <v-button icon small @click="editing = editTarget = null">
            <v-icon>close</v-icon>
          </v-button>
        </template>

        <config-game-rules v-if="editing == 'game'" v-model="editTarget" />
        <config-user-options v-if="editing == 'user'" v-model="editTarget" />

        <template v-slot:actions>
          <v-grow />
          <v-button color="primary" @click="save()">Save</v-button>
        </template>
      </v-card>
    </v-dialog>

    <v-flex column grow>
      <canvas ref="canvas" />

      <v-grow />

      <v-flex justify-center>
        <v-button @click="edit('game')">
          <v-icon class="mr-3">settings</v-icon>
          <span>Game Rules</span>
        </v-button>

        <v-button @click="edit('user')" class="ml-3">
          <v-icon class="mr-3">settings</v-icon>
          <span>User Config</span>
        </v-button>
      </v-flex>
    </v-flex>
  </v-app>
</template>

<script>
import { onMounted, shallowReactive, shallowRef, watch, watchEffect } from 'vue';

import { onKeyDown, R } from '@/input';
import { Vec } from '@/vec';
import { new_game, reactive_game, run_game } from '@/tetris';
import { wall_kicks } from '@/tetris/config';
import { render as pixi_render } from '@/tetris/render/pixi';

import configGameRules from './view/config/config-game-rules';
import configUserOptions from './view/config/config-user-options';

export default {
  name: 'tetris',

  components: {
    configGameRules,
    configUserOptions,
  },

  setup() {
    let canvas = shallowRef();

    let game_rules = shallowReactive({
      field_size: new Vec(10, 40),
      fall_delay: 50,
      lock_delay: 30,
      move_reset_limit: 15,

      wall_kicks: wall_kicks.standard,

      bag_preview: 5,
    });

    let user_prefs = shallowReactive({
      autoshift: shallowReactive({ delay: 2, initial_delay: 10 }),
      soft_drop: 10,
    });

    let current_game = null;
    let start_game = () => {
      if (current_game)
        current_game.state.dead = true;

      const state = reactive_game(new_game(game_rules));
      current_game = run_game(game_rules, user_prefs, state);

      // basic_render(canvas, game);
      pixi_render(canvas.value, current_game);
    };

    onMounted(() => {
      start_game();
    });

    onKeyDown(R, () => start_game());

    let editing = shallowRef(null);
    let editTarget = shallowRef(null);

    return {
      canvas,
      editing,
      editTarget,

      game_rules, user_prefs,

      edit(name) {
        if (name == 'game') {
          editTarget.value = game_rules;
        } else if (name == 'user') {
          editTarget.value = user_prefs;
        }

        editing.value = name;
      },

      save() {
        if (editing.value == 'game') {
          Object.assign(game_rules, editTarget.value);
        } else if (editing.value == 'user') {
          Object.assign(user_prefs, editTarget.value);
        }

        editing.value = null;
        editTarget.value = null;
      },
    };
  },
};
</script>

<style lang="scss">
#app {
  width: 100vw;
  height: 100vh;
}
</style>

<style lang="scss" scoped>
canvas {
}
</style>
