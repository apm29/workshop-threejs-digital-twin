<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { SceneInjectKey } from "./inject-keys"

const scene = inject(SceneInjectKey)
const axesHelper = new THREE.AxesHelper(5000);
scene.add(axesHelper)

</script>

<style lang="scss" scoped>

</style>
