<template>
  <v-tooltip right :text="description">
    <v-input
      :label="name"
      style="cursor: text"
      @click="$refs.top.focus()"
      :warning="state.error"
    >
      <template v-slot="{ id }">
        <v-flex>
          <input
            ref="top"
            :id="id"
            :style="{ width: `3ch` }"
            :value="state.top"
            @input="setTop($event.target.value)"
          />

          <v-flex class="mx-2" column justify-center>
            <v-text>/</v-text>
          </v-flex>

          <input
            @click.stop
            :value="state.bot"
            @input="setBot($event.target.value)"
          />
        </v-flex>
      </template>
    </v-input>
  </v-tooltip>
</template>

<script>
import { shallowReactive, watch } from 'vue';

export default {
  name: 'config-rational',

  emits: ['update:modelValue'],
  props: {
    name: String,
    description: String,
    modelValue: Number,
    filter: Function,
  },

  setup(props, { emit }) {
    let state = shallowReactive({
      top: null,
      bot: null,
      error: false,
    });

    watch(() => props.modelValue, () => {
      if (props.modelValue > 1) {
        state.top = props.modelValue.toString();
        state.bot = '1';
      } else {
        state.top = '1';
        state.bot = 1 / props.modelValue.toString();
      }
    }, { immediate: true });

    return {
      state,

      setTop(v) {
        state.top = v;
        state.bot = '1';

        let num = parseInt(v, 10);
        if (num.toString() != v || props.filter && !props.filter(num)) {
          state.error = true;
        } else {
          state.error = false;
          emit('update:modelValue', num);
        }
      },

      setBot(v) {
        state.top = '1';
        state.bot = v;

        let num = 1 / parseInt(v, 10);
        if ((1 / num).toString() != v || props.filter && !props.filter(num)) {
          state.error = true;
        } else {
          state.error = false;
          emit('update:modelValue', num);
        }
      },
    };
  },
};
</script>

<style lang="scss" scoped>
@import "@mfro/vue-ui/src/style.scss";

input {
  color: inherit;
  font-size: $text-unit;
  outline: none;

  font-family: Roboto;
  font-weight: normal;
}
</style>
