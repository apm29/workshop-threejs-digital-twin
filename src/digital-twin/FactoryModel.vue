<template>
  <Scene w="full" h="full" @object:selected="handleSelect"> </Scene>
</template>

<script setup>
import Scene from "./3d/Scene.vue";

function handleSelect(object) {
  console.log("选择:", object);
}
</script>

<style lang="scss" scoped></style>
