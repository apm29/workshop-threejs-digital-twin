<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import * as THREE from "three";
import { CameraInjectKey, RendererInjectKey, WidthInjectKey, HeightInjectKey } from "./inject-keys"
import { useThree } from "./three";

const { setCamera } = useThree()


const renderer = inject(RendererInjectKey)
const width = inject(WidthInjectKey)
const height = inject(HeightInjectKey)

const camera = new THREE.PerspectiveCamera(
  75, //fov
  unref(width) / unref(height),
  0.1, //near
  5000, //far
)

camera.position.x = 20
camera.position.y = 20
camera.position.z = 20

//监听视窗大小变化
watch([width, height], () => {
  camera.aspect = unref(width) / unref(height)
  camera.updateProjectionMatrix();
})

provide(CameraInjectKey, camera)
setCamera(camera)


//control
const controls = new OrbitControls(camera, renderer.domElement)
controls.listenToKeyEvents(window); // optional
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 0.1;
controls.maxDistance = 1000;
controls.maxPolarAngle = (Math.PI) / 2 * 0.99;
</script>

<style lang="scss" scoped>

</style>
