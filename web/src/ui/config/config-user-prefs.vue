<template>
  <config-autoshift v-model="autoshift" />

  <config-number
    name="Soft drop multiplier"
    description="Gravity multiplier when soft dropping"
    v-model="soft_drop"
    :filter="(v) => v >= 0"
  />

  <config-render v-model="render" />
</template>

<script>
import { computed } from 'vue';

import configAutoshift from './config-autoshift';
import configNumber from './config-number';
import configRender from './config-render';

function field(emit, target, key, get = v => v, set = v => v) {
  return computed({
    get: () => get(target()[key]),
    set: (value) => {
      let rules = { ...target(), [key]: set(value) };
      emit('update:modelValue', rules);
    },
  });
}

export default {
  name: 'config-game-rules',
  components: {
    configAutoshift,
    configNumber,
    configRender,
  },

  emits: ['update:modelValue'],
  props: {
    modelValue: Object,
  },

  setup(props, { emit }) {
    let autoshift = field(emit, () => props.modelValue, 'autoshift');
    let soft_drop = field(emit, () => props.modelValue, 'soft_drop');
    let render = field(emit, () => props.modelValue, 'render');

    return {
      autoshift,
      soft_drop,
      render,
    };
  },
};
</script>
