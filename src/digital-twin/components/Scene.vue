<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import Stats from "three/addons/libs/stats.module.js";
import * as THREE from "three";
import { CameraInjectKey, RendererInjectKey, RenderLoopInjectKey, SceneInjectKey, SelectableGroupInjectKey } from "./inject-keys"
import { useThree } from "./three";
const { setScene } = useThree()
const scene = new THREE.Scene()
//背景色
scene.background = new THREE.Color().setHSL(0.6, 0, 1)
//雾
scene.fog = new THREE.Fog(scene.background, 1, 5000)
//可选择得组
const group = new THREE.Group()
scene.add(group)

provide(SceneInjectKey, scene)
provide(SelectableGroupInjectKey, group)
setScene(scene)

const renderer = inject(RendererInjectKey)
const camera = inject(CameraInjectKey)
//stats
const stats = new Stats();
window.document.body.appendChild(stats.dom);

//render-loop
const loopFunctions = []
function registerLoop(func) {
  if (func && func instanceof Function) {
    loopFunctions.push(func)
  }
}

provide(RenderLoopInjectKey, registerLoop)


function animate() {
  requestAnimationFrame(animate);

  stats.begin()
  renderer.render(scene, camera);
  stats.end()
}
onMounted(animate)
</script>

<style lang="scss" scoped>

</style>
