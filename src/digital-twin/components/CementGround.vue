<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { SceneInjectKey } from "./inject-keys";

const scene = inject(SceneInjectKey);

const grassTexture = new THREE.TextureLoader().load("./textures/cement.jpg");
grassTexture.wrapS = grassTexture.wrapT = THREE.MirroredRepeatWrapping;
grassTexture.encoding = THREE.sRGBEncoding;
//texture重复次数,5000 / 200 每张素材250 * 250 像素
grassTexture.repeat.set(20, 20);
grassTexture.anisotropy = 16;
//GROUND
const groundGeo = new THREE.PlaneGeometry(60, 100, 12, 20);
const groundMat = new THREE.MeshPhongMaterial({
  // color: 0x031643,
  // wireframe: true,
  map: grassTexture,
  // wireframeLinejoin: 'bevel'
});

const ground = new THREE.Mesh(groundGeo, groundMat);
ground.position.y = -0.1;
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;

scene.add(ground);

onBeforeUnmount(() => {
  scene.remove(ground);
});
</script>

<style lang="scss" scoped></style>
