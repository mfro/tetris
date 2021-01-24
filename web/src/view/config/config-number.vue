<template>
  <v-tooltip right :text="description">
    <v-text-field
      :label="name"
      :model-value="state.editing"
      @update:model-value="onInput"
      @blur="onBlur"
      :warning="state.error"
    />
  </v-tooltip>
</template>

<script>
import { shallowReactive, watch } from 'vue';

export default {
  name: 'config-number',

  emits: ['update:modelValue'],
  props: {
    name: String,
    description: String,
    modelValue: Number,
    filter: Function,
  },

  setup(props, { emit }) {
    let state = shallowReactive({
      editing: null,
      error: false,
    });

    watch(() => props.modelValue, () => {
      state.editing = props.modelValue.toString();
    }, { immediate: true });

    return {
      state,

      onInput(v) {
        state.editing = v;

        let num = parseInt(v, 10);

        if (num.toString() != v || props.filter && !props.filter(num)) {
          state.error = true;
        } else {
          state.error = false;
          emit('update:modelValue', num);
        }
      },

      onBlur() {
        state.editing = props.modelValue.toString();
        state.error = false;
      },
    };
  },
};
</script>

<style lang="scss" module>
div.root :global(input) {
  width: 10ch;
  // text-align: end;
}
</style>
