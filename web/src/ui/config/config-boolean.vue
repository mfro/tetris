<template>
  <v-tooltip right :text="description">
    <v-input :label="name" @click="value = !value">
      <template v-slot="{ id }">
        <v-checkbox :id="id" v-model="value" @click.stop />
      </template>
    </v-input>
    <!-- <
    <v-checkbox>

    </v-checkbox>
    <v-text-field
      :label="name"
      :model-value="state.editing"
      @update:model-value="onInput"
      :warning="state.error"
    /> -->
  </v-tooltip>
</template>

<script>
import { computed, nextTick, shallowReactive, watch } from 'vue';

export default {
  name: 'config-boolean',

  emits: ['update:modelValue'],
  props: {
    name: String,
    description: String,
    modelValue: Boolean,
  },

  setup(props, { emit }) {
    const value = computed({
      get: () => props.modelValue,
      set: (v) => emit('update:modelValue', v),
    });

    return {
      value,
    };
  },
};
</script>

<style lang="scss" module>
div.root :global(input) {
  width: 10ch;
}
</style>
