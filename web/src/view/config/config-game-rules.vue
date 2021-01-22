<template>
  <v-card>
    <template v-slot:title>
      <v-text title>Game Rules</v-text>
    </template>

    <v-flex column class="pa-4">
      <config-rational
        name="Drop Delay"
        description="Drop delay for falling pieces (frames per tile)"
        v-model="rules.fall_delay"
      />

      <config-rational
        name="Lock Delay"
        description="Delay after hitting the floor before a piece locks down (frames)"
        v-model="rules.lock_delay"
      />
    </v-flex>
  </v-card>
</template>

<script>
import { shallowReactive } from 'vue';

import { Vec } from '@/vec';
import { wall_kicks } from '@/tetris/config';

import configRational from './config-rational';

export default {
  name: 'config-game-rules',

  components: {
    configRational,
  },

  setup() {
    let rules = shallowReactive({
      field_size: new Vec(10, 40),
      fall_delay: 30,
      lock_delay: 30,
      move_reset_limit: 15,

      wall_kicks: wall_kicks.asira,

      bag_preview: 5,
    });

    return { rules };
  },
};
</script>

<style>
</style>
