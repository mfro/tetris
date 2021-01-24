<template>
  <v-tooltip right :text="description">
    <v-input :label="name" @click="$refs.select.click()">
      <template v-slot="{ id }">
        <select :id="id" v-model="value" ref="select">
          <option v-for="(option, i) in options" :key="option[0]" :value="i">
            {{ option[0] }}
          </option>
        </select>
      </template>
    </v-input>
  </v-tooltip>

  <!-- <config-value :name="name" :description="description">
    <v-select
      small
      v-model="value"
      :options="options"
      :text="(o) => o[0]"
      :value="(o) => o[1]"
    />
  </config-value> -->
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'config-select',

  emits: ['update:modelValue'],
  props: {
    name: String,
    description: String,
    modelValue: {},
    options: Array,
  },

  setup(props, { emit }) {
    let value = computed({
      get: () => props.options.findIndex(pair => pair[1] == props.modelValue),
      set: (v) => {
        emit('update:modelValue', props.options[v][1]);
      },
    });

    return { value };
  },
};
</script>

<style lang="scss" scoped>
select {
  outline: none;
  width: calc(100% + 32px);
  margin: -30px -16px -8px -16px;
  padding: 30px 16px 7px;
}
</style>
