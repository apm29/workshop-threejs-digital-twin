<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { SceneInjectKey } from "./inject-keys"
import GUI from 'lil-gui'

const scene = inject(SceneInjectKey)
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x808080, 0.8);
hemiLight.position.set(0, 500, 0);
hemiLight.visible = true;
scene.add(hemiLight);

const ambientLight = new THREE.AmbientLight(0x909090, 0.7)
scene.add(ambientLight)

const dirLight = new THREE.DirectionalLight(0x909090, 0.7);
dirLight.position.set(100, 300, 100);
// dirLight.position.multiplyScalar(30);
dirLight.visible = true;
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;

const d2 = 500;
dirLight.shadow.camera.left = -d2;
dirLight.shadow.camera.right = d2;
dirLight.shadow.camera.top = d2;
dirLight.shadow.camera.bottom = -d2;

dirLight.shadow.camera.far = 3500;
dirLight.shadow.bias = 0;

scene.add(dirLight);
</script>

<style lang="scss" scoped>

</style>
