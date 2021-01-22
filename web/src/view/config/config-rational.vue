<template>
  <v-flex column class="mt-4">
    <v-flex align-baseline>
      <v-text>{{ name }}</v-text>
      <v-flex grow class="mx-4" />
      <v-text>{{ description }}</v-text>
    </v-flex>

    <v-flex>
      <v-flex class="mt-4" column justify-center>
        <v-text>{{ modelValue }}</v-text>
      </v-flex>

      <v-flex grow class="mx-4" />

      <v-text-field solo small v-model="top" />

      <v-flex class="mt-4 mx-2" column justify-center>
        <v-text title> / </v-text>
      </v-flex>

      <v-text-field solo small v-model="bot" />
    </v-flex>
  </v-flex>
</template>

<script>
import { computed } from 'vue';
export default {
  name: 'config-rational',

  emits: ['update:modelValue'],
  props: {
    name: String,
    description: String,
    modelValue: Number,
  },

  setup(props, { emit }) {
    let top = computed({
      get: () => {
        if (props.modelValue > 1) {
          return props.modelValue.toString();
        } else {
          return '1';
        }
      },

      set: (v) => {
        let num = parseInt(v);
        emit('update:modelValue', num);
      },
    });

    let bot = computed({
      get: () => {
        if (props.modelValue < 1) {
          return (1 / props.modelValue).toString();
        } else {
          return '1';
        }
      },

      set: (v) => {
        let num = parseInt(v);
        emit('update:modelValue', 1 / num);
      },
    });

    return { top, bot };
  },
};
</script>

<style>
</style>
