<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { SceneInjectKey } from "./inject-keys"

const scene = inject(SceneInjectKey)

const grassTexture = new THREE.TextureLoader().load('/textures/grass.jpeg');
grassTexture.wrapS = grassTexture.wrapT = THREE.MirroredRepeatWrapping;
grassTexture.encoding = THREE.sRGBEncoding;
//texture重复次数,5000 / 200 每张素材250 * 250 像素
grassTexture.repeat.set(200, 200);
grassTexture.anisotropy = 16;
//GROUND
const groundGeo = new THREE.PlaneGeometry(5000, 5000);
const groundMat = new THREE.MeshBasicMaterial({
  map: grassTexture,
});
groundMat.color.setHSL(0.095, 1, 0.75);

const ground = new THREE.Mesh(groundGeo, groundMat);
ground.position.y = -0.1;
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;

scene.add(ground);

</script>

<style lang="scss" scoped>

</style>
