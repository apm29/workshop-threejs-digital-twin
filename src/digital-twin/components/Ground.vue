<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { SceneInjectKey } from "./inject-keys";

const scene = inject(SceneInjectKey);

const grassTexture = new THREE.TextureLoader().load("./textures/grass02.png");
grassTexture.wrapS = grassTexture.wrapT = THREE.MirroredRepeatWrapping;
grassTexture.encoding = THREE.sRGBEncoding;
grassTexture.repeat.set(100, 100);
grassTexture.anisotropy = 16;
//GROUND
const groundGeo = new THREE.PlaneGeometry(2000, 2000, 100, 100);
const groundMat = new THREE.MeshPhongMaterial({
  // color: 0x000,
  // wireframe: true,
  map: grassTexture,
  // wireframeLinejoin: 'bevel'
});

const ground = new THREE.Mesh(groundGeo, groundMat);
ground.position.y = -0.15;
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = false;

scene.add(ground);
</script>

<style lang="scss" scoped></style>
