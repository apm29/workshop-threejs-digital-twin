<template></template>
<script setup>
import * as THREE from "three";
import { useCreateObject } from "../helpers/lifecycle";
useCreateObject(createBox);
//测试3d盒子
function createBox(scene, camera, renderer) {
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 5;

  function animate() {
    requestAnimationFrame(animate);

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render(scene, camera);
  }

  animate();
}
</script>

<style lang="scss" scoped></style>
