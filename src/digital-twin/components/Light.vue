<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { SceneInjectKey } from "./inject-keys";
import GUI from "lil-gui";

const scene = inject(SceneInjectKey);
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x808080, 0.3);
hemiLight.position.set(0, 300, 0);
hemiLight.visible = true;
hemiLight.castShadow = false;
scene.add(hemiLight);

const ambientLight = new THREE.AmbientLight(0x909090, 1);
ambientLight.castShadow = false;
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(-100, 300, -100);
dirLight.visible = true;
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;

const d2 = 100;
dirLight.shadow.camera.left = -d2;
dirLight.shadow.camera.right = d2;
dirLight.shadow.camera.top = d2;
dirLight.shadow.camera.bottom = -d2;

dirLight.shadow.bias = -0.0001;

scene.add(dirLight);

onBeforeUnmount(() => {
  // scene.remove(dirLight);
  // scene.remove(ambientLight);
  // scene.remove(hemiLight);
});
</script>

<style lang="scss" scoped></style>
