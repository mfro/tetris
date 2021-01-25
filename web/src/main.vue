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
        <config-user-prefs v-if="editing == 'user'" v-model="editTarget" />

        <template v-slot:actions>
          <v-grow />
          <v-button color="primary" @click="save()">Save</v-button>
        </template>
      </v-card>
    </v-dialog>

    <v-flex column grow>
      <clipboard v-if="remote.state == 1" class="pb-4" :value="link" />

      <v-flex>
        <game v-if="local_game" :value="local_game" />

        <game v-if="remote.local" :value="remote.local" />
        <game v-if="remote.remote" :value="remote.remote" />
      </v-flex>

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
import { computed, shallowReactive, shallowRef, watch } from 'vue';

import { onKeyDown, R } from '@/input';
import { Vec } from '@/vec';
import { play, new_game, reactive_state, empty_state } from '@/tetris';
import { wall_kicks } from '@/tetris/config';
import { remote_game } from '@/remote';

import game from './view/game';
import clipboard from './view/clipboard';
import configGameRules from './view/config/config-game-rules';
import configUserPrefs from './view/config/config-user-prefs';

export default {
  name: 'tetris',

  components: {
    game,
    clipboard,
    configGameRules,
    configUserPrefs,
  },

  setup() {
    const game_rules = shallowReactive({
      field_size: new Vec(10, 40),
      fall_delay: 50,
      lock_delay: 30,
      move_reset_limit: 15,

      wall_kicks: wall_kicks.standard,

      bag_preview: 5,
    });

    const user_prefs = shallowReactive({
      autoshift: shallowReactive({ delay: 2, initial_delay: 10 }),
      soft_drop: 10,
    });

    const editing = shallowRef(null);
    const editTarget = shallowRef(null);

    const local_game = shallowRef(null);
    const remote = remote_game(game_rules, user_prefs);

    const play_local = computed(() => {
      return remote.local == null;
    });

    let localCleanup;
    watch(play_local, (v) => {
      if (v) {
        const state = reactive_state(empty_state(game_rules));
        local_game.value = new_game(game_rules, state);
        localCleanup = play(user_prefs, local_game.value);
      } else {
        localCleanup?.();
        local_game.value = null;
      }
    }, { immediate: true });

    const base = window.location;
    const link = computed(() => `${base.origin}${base.pathname}?code=${remote.code}`);

    return {
      link,

      remote,
      local_game,

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
  width: 0;
}
</style>
