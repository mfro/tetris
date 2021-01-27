<template>
  <v-dialog :model-value="editing">
    <edit-config kind="game" v-model="game_rules" @close="editing = false" />
  </v-dialog>

  <v-flex column grow align-center>
    <v-card v-if="!room.local">
      <template v-slot:title>
        <v-flex grow align-start>
          <v-text title>Tetris Lobby</v-text>

          <v-grow class="mx-6" />
          <v-grow class="mx-6" />

          <clipboard :value="link" />
        </v-flex>
      </template>

      <v-flex column class="pt-4">
        <v-flex v-for="member in room.members" :key="member" class="px-4">
          <v-icon class="mr-3" v-if="member.winner" style="color: #ffc107">emoji_events</v-icon>
          <v-text class="my-3">{{ member.name }}</v-text>
        </v-flex>
      </v-flex>

      <template v-slot:actions v-if="room.index == 0">
        <v-button text @click="editing = true" class="mr-3">
          <v-icon class="mr-3">settings</v-icon>
          <span>Game rules</span>
        </v-button>

        <v-grow />

        <v-button @click="start()" color="primary">
          <span>Start game</span>
        </v-button>
      </template>
    </v-card>

    <v-flex v-else>
      <game :value="room.local" />

      <v-flex>
        <game v-for="member in others" :key="member" :value="member.game" />
      </v-flex>
    </v-flex>
  </v-flex>
</template>

<script>
import { computed, shallowReactive, shallowRef } from 'vue';

import { Vec } from '@/vec';
import { wall_kicks } from '@/tetris/config';

import game from '@/ui/game';
import clipboard from '@/ui/clipboard';
import editConfig from '@/ui/edit-config';

export default {
  name: 'room',
  components: {
    game,
    clipboard,
    editConfig,
  },

  props: ['room'],

  setup(props) {
    const base = window.location;
    const link = computed(() => `${base.origin}${base.pathname}?code=${props.room.code}`);

    const editing = shallowRef(false);
    const game_rules = shallowReactive({
      field_size: new Vec(10, 40),
      fall_delay: 50,
      lock_delay: 30,
      move_reset_limit: 15,

      wall_kicks: wall_kicks.standard,

      bag_preview: 5,
    });

    const others = computed(() => {
      return props.room.members.filter((_, i) => i != props.room.index);
    });

    return {
      link,

      editing,
      game_rules,
      others,

      start() {
        props.room.start_game(game_rules);
      },
    };
  },
};
</script>
