<template>
  <canvas ref="canvas" />
</template>

<script>
import { onMounted, ref, shallowRef, toRef, watch } from 'vue';

import { render as pixi_render } from '@/tetris/render/pixi';

export default {
  name: 'game',

  props: {
    value: Object,
  },

  setup(props) {
    let value = toRef(props, 'value');
    let canvas = ref(null);
    let cleanup;

    onMounted(() => {
      watch(value, (game, v) => {
        cleanup?.();

        if (game) {
          cleanup = pixi_render(canvas.value, game);
        }
      }, { immediate: true });
    });

    return { canvas };
  },
};
</script>

<style>
</style>
