<template>
  <config-rational
    name="Gravity"
    description="Gravity for falling pieces (tiles per frame)"
    v-model="gravity"
    :filter="(v) => v <= 20"
  />

  <config-number
    name="Lock delay"
    description="Delay after touching the ground before a piece locks down (frames)"
    v-model="lock_delay"
    :filter="(v) => v >= 0"
  />

  <config-number
    name="Move reset limit"
    description="Maximum number of times the lock delay can be reset by successful shifts or rotates"
    v-model="move_reset_limit"
    :filter="(v) => v >= 0"
  />

  <config-number
    name="Preview size"
    description="Number of pieces in the preview"
    v-model="bag_preview"
    :filter="(v) => v >= 0 && v <= 6"
  />

  <config-select
    name="Wall kick style"
    description="Wall kick configuration to use for rotations"
    v-model="wall_kicks"
    :options="wallKickOptions"
  />
</template>

<script>
import { computed } from 'vue';

import { wall_kicks } from '@/tetris/config';

import configSelect from './config-select';
import configNumber from './config-number';
import configRational from './config-rational';

const wallKickOptions = [
  ['No Kicks', wall_kicks.none],
  ['Standard', wall_kicks.standard],
  ['Asira', wall_kicks.asira],
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
  name: 'config-game-rules',
  components: {
    configSelect,
    configNumber,
    configRational,
  },

  emits: ['update:modelValue'],
  props: {
    modelValue: Object,
  },

  setup(props, { emit }) {
    let gravity = field(emit, () => props.modelValue, 'fall_delay', v => 1 / v, v => 1 / v);
    let lock_delay = field(emit, () => props.modelValue, 'lock_delay');
    let move_reset_limit = field(emit, () => props.modelValue, 'move_reset_limit');
    let bag_preview = field(emit, () => props.modelValue, 'bag_preview');
    let wall_kicks = field(emit, () => props.modelValue, 'wall_kicks');

    return {
      gravity,
      lock_delay,
      move_reset_limit,
      bag_preview,
      wall_kicks,
      wallKickOptions,
    };
  },
};
</script>

<style>
</style>
