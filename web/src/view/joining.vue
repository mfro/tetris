<template>
  <v-flex column grow align-center>
    <v-card class="mb-4">
      <v-text-field label="Code" v-model="code" />

      <v-text-field label="Name" v-model="name" />

      <v-flex justify-center class="my-2">
        <v-button text color="primary" :disabled="!valid" @click="submit()">
          <span>Join lobby</span>
          <v-icon class="ml-3">arrow_forward</v-icon>
        </v-button>
      </v-flex>
    </v-card>
  </v-flex>
</template>

<script>
import { computed, inject, shallowRef } from 'vue';

import { create_room } from '@/tetris/remote';

export default {
  name: 'joining',

  emits: ['room'],
  props: {
    code: String,
  },

  setup(props, { emit }) {
    const name = shallowRef(localStorage.getItem('mfro:user-name') ?? '');
    const code = shallowRef(props.code);

    const valid = computed(() => {
      return name.value != '';
    });

    const user_prefs = inject('user_prefs');

    return {
      name,
      code,
      valid,

      submit() {
        localStorage.setItem('mfro:user-name', name.value);
        let room = create_room(name.value, user_prefs, code.value);
        emit('room', room);
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
