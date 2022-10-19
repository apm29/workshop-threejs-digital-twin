<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { SceneInjectKey, SelectableGroupInjectKey } from "./inject-keys";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const scene = inject(SceneInjectKey);

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  position: {
    type: Object,
  },
  size: {
    type: Number,
    default: 1,
  },
});

const textureLoader = new THREE.TextureLoader();

const BASE_Z = 40;
const BASE_Y = 0;
const BASE_X = 0;

textureLoader.load(props.path, function (texture) {
  const material = new THREE.SpriteMaterial({
    map: texture,
  });
  const label = new THREE.Sprite(material);
  label.center.set(0.0, 1.0);
  label.scale.set(props.size, props.size, 1);
  if (props.position) {
    label.position.x = (props.position.x || 0) + BASE_X;
    label.position.y = (props.position.y || 0) + BASE_Y;
    label.position.z = (props.position.z || 0) + BASE_Z;
  } else {
    label.position.x = BASE_X;
    label.position.y = BASE_Y;
    label.position.z = BASE_Z;
  }
  scene.add(label);
});
</script>

<style lang="scss" scoped></style>
