<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import {
  CameraInjectKey,
  RendererInjectKey,
  RenderLoopInjectKey,
  OrbitControlInjectKey,
} from "./inject-keys";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useThree } from "./three";

const props = defineProps({
  namespace: {
    type: String,
    default: "app",
  },
});

const { setControl } = useThree(props.namespace);

const renderer = inject(RendererInjectKey);
const camera = inject(CameraInjectKey);
const registerLoopFunc = inject(RenderLoopInjectKey);
//control
const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window); // optional
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.autoRotate = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 0.1;
controls.maxDistance = 100;
controls.maxPolarAngle = (Math.PI / 2) * 1.5;
setControl(controls);
provide(OrbitControlInjectKey, controls);

registerLoopFunc(() => {
  controls.update();
});
</script>

<style lang="scss" scoped></style>
