<template>
  <v-flex align-center justify-center>
    <v-button small icon @click="copy()" @mouseleave="copied = false">
      <v-icon small v-if="!copied">content_paste</v-icon>
      <v-icon small v-else bold style="color: #4caf50">check</v-icon>
    </v-button>

    <v-text-field small class="mt-0 ml-4" ref="input" solo :model-value="value" />
  </v-flex>
</template>

<script>
import { shallowRef } from 'vue';

export default {
  name: 'clipboard',

  props: {
    value: String,
  },

  setup(props) {
    const input = shallowRef(null);
    const copied = shallowRef(false);

    return {
      input, copied,
      copy: () => {
        input.value.select();
        document.execCommand('copy');
        copied.value = true;
      },
    };
  },
};
</script>

<style>
</style>
