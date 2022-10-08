<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { SceneInjectKey } from "./inject-keys"
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";


const props = defineProps({
  path: {
    type: String,
    required: true
  }
})
const scene = inject(SceneInjectKey)
const gltfLoader = new GLTFLoader();
gltfLoader.load(props.path, (gltf) => {
  const root = gltf.scene;

  gltf.scene.traverse(function (obj) {
    if (obj instanceof THREE.Mesh) {
      console.log(obj);
      const oldTexture = obj.material.map
      const defaultMaterial = new THREE.MeshLambertMaterial({
        color: obj.material.color,
      });
      obj.material = defaultMaterial
      obj.material.map = oldTexture
      obj.material.side = THREE.DoubleSide;
      obj.castShadow = true;
      // obj.receiveShadow = true;
    }
  });

  scene.add(root);
});


</script>

<style lang="scss" scoped>

</style>
