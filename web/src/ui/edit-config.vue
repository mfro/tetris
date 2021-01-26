<template>
  <v-card style="min-width: 60ch">
    <template v-slot:title>
      <v-text title v-if="kind == 'game'">Game rules</v-text>
      <v-text title v-if="kind == 'user'">User preferences</v-text>

      <v-grow />

      <v-button icon small @click="$emit('close')">
        <v-icon>close</v-icon>
      </v-button>
    </template>

    <config-game-rules v-if="kind == 'game'" v-model="value" />
    <config-user-prefs v-if="kind == 'user'" v-model="value" />

    <template v-slot:actions>
      <v-grow />

      <v-button color="primary" @click="save()">
        <span>Save</span>
      </v-button>
    </template>
  </v-card>
</template>

<script>
import { shallowRef, watch } from 'vue';
import configGameRules from './config/config-game-rules';
import configUserPrefs from './config/config-user-prefs';

export default {
  name: 'edit-config',
  components: {
    configGameRules,
    configUserPrefs,
  },

  emits: ['close', 'update:modelValue'],
  props: {
    kind: String,
    modelValue: Object,
  },

  setup(props, { emit }) {
    const value = shallowRef(props.modelValue);

    watch(() => props.modelValue, v => value.value = v);

    return {
      value,

      save() {
        emit('update:modelValue', value.value);
        emit('close');
      },
    }
  },
};
</script>

<style>
</style>
