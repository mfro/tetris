<template>
  <config-select
    name="Render Style"
    description="Wall kick configuration to use for rotations"
    v-model="style"
    :options="styleOptions"
  />

  <template v-if="style == 'toon'">
    <config-number
      name="Tile size"
      description="Size in pixels of each square on the field"
      v-model="size"
      :filter="(v) => v > 0"
    />

    <config-boolean
      name="Smooth rendering"
      description="Join tiles of the same tetronimo"
      v-model="smooth"
    />

    <config-number
      name="Border width"
      description="Size of the tile border"
      v-model="border"
      :filter="(v) => v >= 0 && v <= size / 2"
    />
  </template>

  <template v-if="style == 'pixel'">
    <config-number
      name="Tile size"
      description="Size in pixels of each square on the field"
      v-model="size"
      :filter="(v) => v > 0"
    />

    <config-boolean
      name="Smooth rendering"
      description="Join tiles of the same tetronimo"
      v-model="smooth"
    />

    <config-number
      name="Border width"
      description="Size of the tile border"
      v-model="border"
      :filter="(v) => v >= 0 && v <= size / 2"
    />

    <config-number
      name="Ghost opacity"
      description="Opacity of the ghost preview"
      v-model="ghost_opacity"
      :filter="(v) => v >= 0 && v <= 1"
    />
  </template>

  <template v-if="style == 'tetrio'">
    <config-boolean
      name="Ghost color"
      description="Color the ghost tile"
      v-model="ghost_color"
    />
  </template>
</template>

<script>
import { computed } from 'vue';

import configAutoshift from './config-autoshift';
import configBoolean from './config-boolean';
import configNumber from './config-number';
import configSelect from './config-select';

const styleOptions = [
  ['toon', 'toon'],
  ['pixel', 'pixel'],
  ['tetr.io', 'tetrio'],
];

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
  name: 'config-render',
  components: {
    configAutoshift,
    configBoolean,
    configNumber,
    configSelect,
  },

  emits: ['update:modelValue'],
  props: {
    modelValue: Object,
  },

  setup(props, { emit }) {
    let size = field(emit, () => props.modelValue, 'size');
    let smooth = field(emit, () => props.modelValue, 'smooth');
    let style = field(emit, () => props.modelValue, 'style');
    let border = field(emit, () => props.modelValue, 'border');
    let ghost_opacity = field(emit, () => props.modelValue, 'ghost_opacity');
    let ghost_color = field(emit, () => props.modelValue, 'ghost_color');

    return {
      size,
      smooth,
      style,
      border,
      ghost_opacity,
      ghost_color,
      styleOptions,
    };
  },
};
</script>
