<template>
  <v-dialog :model-value="editing">
    <edit-config kind="game" v-model="game_rules" @close="editing = false" />
  </v-dialog>

  <v-flex column grow align-center>
    <game :value="local_game" />

    <v-grow />

    <!-- <v-flex justify-center>
      <v-button @click="editing = true">
        <v-icon class="mr-3">settings</v-icon>
        <span>Game rules</span>
      </v-button>
    </v-flex> -->

    <v-card class="mt-4">
      <v-text-field label="Name" v-model="name" />

      <v-flex justify-center class="my-2">
        <v-button
          text
          color="primary"
          :disabled="!valid"
          @click="create_room()"
        >
          <span>Create lobby</span>
          <v-icon class="ml-3">arrow_forward</v-icon>
        </v-button>
      </v-flex>
    </v-card>
  </v-flex>
</template>

<script>
import { computed, inject, onBeforeUnmount, onMounted, shallowReactive, shallowRef } from 'vue';

import { Vec } from '@/vec';
import { onKeyDown, R } from '@/input';
import { play_local, new_game, reactive_state, empty_state } from '@/tetris';
import { wall_kicks } from '@/tetris/config';
import { create_room } from '@/tetris/remote';

import game from '@/ui/game';
import editConfig from '@/ui/edit-config';
import configGameRules from '@/ui/config/config-game-rules';
import configUserPrefs from '@/ui/config/config-user-prefs';

export default {
  name: 'landing',
  components: {
    game,
    editConfig,
    configGameRules,
    configUserPrefs,
  },

  emits: ['room'],

  setup(props, { emit }) {
    const editing = shallowRef(null);
    const game_rules = shallowReactive({
      field_size: new Vec(10, 40),
      fall_delay: 50,
      lock_delay: 30,
      move_reset_limit: 15,

      wall_kicks: wall_kicks.standard,

      bag_preview: 5,
    });

    const user_prefs = inject('user_prefs');

    const local_game = shallowRef(null);

    let local_cleanup;
    const start_game = () => {
      local_cleanup?.();

      const state = reactive_state(empty_state(game_rules));
      local_game.value = new_game(game_rules, state);
      local_cleanup = play_local(user_prefs.value, local_game.value);
    };

    onMounted(() => {
      start_game();
    });

    onBeforeUnmount(() => local_cleanup?.());

    onKeyDown(R, () => start_game());

    const name = shallowRef(localStorage.getItem('mfro:user-name') ?? '');
    const valid = computed(() => {
      return name.value != '';
    });

    return {
      local_game,

      editing,
      game_rules,

      name,
      valid,

      create_room() {
        localStorage.setItem('mfro:user-name', name.value);
        let room = create_room(name.value, user_prefs.value);
        emit('room', room);
      },

      edit(name) {
        editing.value = name;
      },
    };
  },
};
</script>
