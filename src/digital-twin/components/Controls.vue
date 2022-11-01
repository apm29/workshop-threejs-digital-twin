<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import {
  NameSpaceInjectKey,
  CameraInjectKey,
  RendererInjectKey,
  RenderLoopInjectKey,
  OrbitControlInjectKey,
} from "./inject-keys";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { useThree } from "./three";

const props = defineProps({
  autoRotate: {
    type: Boolean,
    default: false,
  },
});

const namespace = inject(NameSpaceInjectKey);

const { setControl } = useThree(namespace);

const renderer = inject(RendererInjectKey);
const camera = inject(CameraInjectKey);
const registerLoopFunc = inject(RenderLoopInjectKey);
//control
const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(renderer.domElement); // optional
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.autoRotate = props.autoRotate ?? false; // an animation loop is required when either damping or auto-rotation are enabled
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
