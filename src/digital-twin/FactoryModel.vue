<template>
  <Scene w="full" h="full" @object:selected="handleSelect">
    <Models></Models>
  </Scene>
</template>

<script setup>
import Scene from "./3d/Scene.vue";
import Models from "./3d/Models.vue";

function handleSelect(object) {
  console.log("选择:", object);
}
</script>

<style lang="scss" scoped></style>
