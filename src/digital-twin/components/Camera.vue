<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import {
  NameSpaceInjectKey,
  CameraInjectKey,
  WidthInjectKey,
  HeightInjectKey,
} from "./inject-keys";
import { useThree } from "./three";
import { INITIAL_CAMERA_X, INITIAL_CAMERA_Y, INITIAL_CAMERA_Z } from "./axes.js";

const props = defineProps({
  position: {
    type: Object,
    default: () => ({
      x: INITIAL_CAMERA_X,
      y: INITIAL_CAMERA_Y,
      z: INITIAL_CAMERA_Z,
    }),
  },
});

const namespace = inject(NameSpaceInjectKey);

const { setCamera } = useThree(namespace);

const width = inject(WidthInjectKey);
const height = inject(HeightInjectKey);

const camera = new THREE.PerspectiveCamera(
  75, //fov
  unref(width) / unref(height),
  0.1, //near
  5000 //far
);

function resetPosition() {
  camera.position.x = props.position?.x ?? INITIAL_CAMERA_X;
  camera.position.y = props.position?.y ?? INITIAL_CAMERA_Y;
  camera.position.z = props.position?.z ?? INITIAL_CAMERA_Z;
}
resetPosition();

//监听视窗大小变化
watch([width, height], () => {
  camera.aspect = unref(width) / unref(height);
  camera.updateProjectionMatrix();
});

watch(() => props.position, resetPosition);

provide(CameraInjectKey, camera);
setCamera(camera);
</script>

<style lang="scss" scoped></style>
