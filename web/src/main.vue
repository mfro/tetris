<template>
  <v-app align-center class="pa-6">
    <canvas ref="canvas" />
  </v-app>
</template>

<script>
import { onMounted, shallowRef } from 'vue';

import { tetris } from './tetris';

export default {
  name: 'tetris',

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
