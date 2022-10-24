<template>
  <div
    absolute="~"
    top="0"
    left="0"
    right="0"
    bottom="0"
    flex="~"
    items="center"
    justify="center"
    v-if="loading"
  >
    <div
      bg="white"
      text="dark-500"
      rounded="lg"
      border="~"
      flex="~"
      items="center"
      justify="center"
      p="x-12 y-6"
    >
      加载模型中 {{ loaded }} / {{ total }}
    </div>
  </div>
</template>

<script setup>
import * as THREE from "three";

const loading = ref();
const loaded = ref(0);
const total = ref(0);
THREE.DefaultLoadingManager.onStart = function (url, itemsLoaded, itemsTotal) {
  // console.log(
  //   "Started loading file: " +
  //     url +
  //     ".\nLoaded " +
  //     itemsLoaded +
  //     " of " +
  //     itemsTotal +
  //     " files."
  // );
  loading.value = true;
  loaded.value = itemsLoaded;
  total.value = itemsTotal;
};

THREE.DefaultLoadingManager.onLoad = function () {
  console.log("Loading Complete!");
  loading.value = false;
};

THREE.DefaultLoadingManager.onProgress = function (url, itemsLoaded, itemsTotal) {
  // console.log(
  //   "Loading file: " + url + ".\nLoaded " + itemsLoaded + " of " + itemsTotal + " files."
  // );
  loading.value = true;
  loaded.value = itemsLoaded;
  total.value = itemsTotal;
};

THREE.DefaultLoadingManager.onError = function (url) {
  console.log("There was an error loading " + url);
};
</script>

<style lang="scss" scoped></style>
