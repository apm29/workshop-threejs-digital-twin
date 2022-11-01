<template>
  <div v-bind="$attrs" v-on="$listeners">
    <slot></slot>
  </div>
</template>

<script setup>
import { NameSpaceInjectKey } from "./inject-keys.js";
const props = defineProps({
  namespace: {
    type: String,
    default: "app",
  },
});

provide(NameSpaceInjectKey, props.namespace);
</script>

<style lang="scss" scoped></style>
