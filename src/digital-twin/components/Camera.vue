<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { CameraInjectKey, WidthInjectKey, HeightInjectKey } from "./inject-keys"
import { useThree } from "./three";

const { setCamera } = useThree()


const width = inject(WidthInjectKey)
const height = inject(HeightInjectKey)

const camera = new THREE.PerspectiveCamera(
  75, //fov
  unref(width) / unref(height),
  0.1, //near
  5000, //far
)

camera.position.x = -15
camera.position.y = 5
camera.position.z = 0


//监听视窗大小变化
watch([width, height], () => {
  camera.aspect = unref(width) / unref(height)
  camera.updateProjectionMatrix();
})

provide(CameraInjectKey, camera)
setCamera(camera)

window.camera = camera



</script>

<style lang="scss" scoped>

</style>
