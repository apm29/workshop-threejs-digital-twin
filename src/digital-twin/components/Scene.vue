<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import Stats from "three/addons/libs/stats.module.js";
import * as THREE from "three";
import { CameraInjectKey, RendererInjectKey, SceneInjectKey } from "./inject-keys"
import { useThree } from "./three";
const { setScene } = useThree()
const scene = new THREE.Scene()
//背景色
scene.background = new THREE.Color().setHSL(0.6, 0, 1)
//雾
scene.fog = new THREE.Fog(scene.background, 1, 5000)

provide(SceneInjectKey, scene)
setScene(scene)

const renderer = inject(RendererInjectKey)
const camera = inject(CameraInjectKey)
//stats
const stats = new Stats();
window.document.body.appendChild(stats.dom);
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  stats.update()
}
animate();
</script>

<style lang="scss" scoped>

</style>
