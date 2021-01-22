<template>
  <v-app align-center class="pa-6">
    <!-- <config-game-rules /> -->
    <canvas ref="canvas" />
  </v-app>
</template>

<script>
import { onMounted, shallowRef } from 'vue';

import { tetris } from './tetris';

import configGameRules from './view/config/config-game-rules';

export default {
  name: 'tetris',

  components: {
    configGameRules
  },

  setup() {
    let canvas = shallowRef();

    onMounted(() => {
      tetris(canvas.value);
    });

    return { canvas };
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
