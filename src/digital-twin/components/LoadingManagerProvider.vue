<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three"
const loadingManager = new THREE.LoadingManager()
provide("LoadingManager",loadingManager)
</script>

<style lang="scss" scoped>

</style>
