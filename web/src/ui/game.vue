<template>
  <canvas ref="canvas" />
</template>

<script>
import { inject, onBeforeUnmount, onMounted, ref, toRef, watch } from 'vue';

import { render } from '@/tetris/render/pixi';
// import { render } from '@/tetris/render/basic';

export default {
  name: 'game',

  props: {
    value: Object,
  },

  setup(props) {
    const value = toRef(props, 'value');
    const canvas = ref(null);
    let cleanup;

    const user_prefs = inject('user_prefs');

    let prevCanvas, prevGame, prevPrefs;
    function reset() {
      if (canvas.value == prevCanvas && value.value == prevGame && user_prefs.value.render == prevPrefs) {
        debugger;
        return;
      }

      cleanup?.();

      cleanup = canvas.value && value.value &&
        render(canvas.value, user_prefs.value.render, value.value);

      prevCanvas = canvas.value;
      prevGame = value.value;
      prevPrefs = user_prefs.value.render;
    }

    watch(value, reset);
    watch(canvas, reset);
    watch(user_prefs, reset);
    onMounted(reset);

    onBeforeUnmount(() => {
      cleanup?.();
    });

    return { canvas };
  },
};
</script>
