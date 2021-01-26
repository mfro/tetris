<template>
  <v-app align-center class="pa-6">
    <v-dialog :model-value="editing_user">
      <edit-config
        kind="user"
        v-model="user_prefs"
        @close="editing_user = false"
      />
    </v-dialog>

    <v-flex class="user pa-4">
      <v-button @click="editing_user = true">
        <v-icon class="mr-3">settings</v-icon>
        <span>User preferences</span>
      </v-button>
    </v-flex>

    <room v-if="current_room != null" :room="current_room" />

    <joining
      v-else-if="joining_code != null"
      :code="joining_code"
      @room="current_room = $event"
    />

    <landing v-else @room="current_room = $event" />
  </v-app>
</template>

<script>
import { computed, provide, shallowRef, watch } from 'vue';

import editConfig from '@/ui/edit-config';

import room from './view/room';
import landing from './view/landing';
import joining from './view/joining';

export default {
  name: 'tetris',

  components: {
    editConfig,

    room,
    landing,
    joining,
  },

  setup() {
    const current_room = shallowRef(null);
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const joining_code = shallowRef(code);

    const raw = localStorage.getItem('mfro:tetris-user-preferences');

    const editing_user = shallowRef(false);
    const user_prefs = raw ? JSON.parse(raw) : {
      autoshift: { delay: 2, initial_delay: 10 },
      soft_drop: 10,
    };

    provide('user_prefs', user_prefs);

    return {
      current_room,
      joining_code,
      editing_user,

      user_prefs: computed({
        get: () => user_prefs,
        set: (v) => {
          Object.assign(user_prefs, v)
          localStorage.setItem('mfro:tetris-user-preferences', JSON.stringify(v));
        },
      }),
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
.user {
  position: absolute;
  left: 0;
  bottom: 0;
}
</style>
