<template>
  <config-number
    name="Autoshift delay"
    description="Delay between repeated shifts while input is held (ARR)"
    v-model="delay"
    :filter="(v) => v >= 0"
  />

  <config-number
    name="Autoshift initial delay"
    description="Delay after the initial shift when pressing an input before repeating (DAS)"
    v-model="initial_delay"
    :filter="(v) => v >= 0"
  />
</template>

<script>
import { computed } from 'vue';

import configNumber from './config-number';

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
  name: 'config-autoshift',
  components: {
    configNumber,
  },

  emits: ['update:modelValue'],
  props: {
    modelValue: Object,
  },

  setup(props, { emit }) {
    let delay = field(emit, () => props.modelValue, 'delay');
    let initial_delay = field(emit, () => props.modelValue, 'initial_delay');

    return {
      delay,
      initial_delay,
    };
  },
};
</script>

<style>
</style>
