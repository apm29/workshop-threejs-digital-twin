<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { SceneInjectKey, SelectableGroupInjectKey } from "./inject-keys";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
const selectableGroup = inject(SelectableGroupInjectKey);
const scene = inject(SceneInjectKey);

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  position: {
    type: Object,
  },
});

const gltfLoader = new GLTFLoader();

const BASE_Z = 40;
const BASE_Y = 0;
const BASE_X = 0;

gltfLoader.load(props.path, (gltf) => {
  const root = gltf.scene;

  // const wireframeMaterial = new THREE.MeshBasicMaterial({
  //   color: 0x5356ff,
  //   wireframe: true,
  //   transparent: true,
  // });

  gltf.scene.traverse(function (obj) {
    if (obj instanceof THREE.Mesh) {
      // console.log(obj);
      // const oldTexture = obj.material.map;
      // const defaultMaterial = new THREE.MeshLambertMaterial({
      //   color: obj.material.color,
      // });
      // obj.material = defaultMaterial
      // obj.material.map = oldTexture
      // obj.material.side = THREE.DoubleSide;
      obj.castShadow = true;
      // obj.receiveShadow = true;

      //线框
      // const frameObj = new THREE.Mesh(obj.geometry, wireframeMaterial);
      // selectableGroup.add(frameObj)
    }
  });

  if (props.position) {
    root.position.x = (props.position.x || 0) + BASE_X;
    root.position.y = (props.position.y || 0) + BASE_Y;
    root.position.z = (props.position.z || 0) + BASE_Z;
  } else {
    root.position.x = BASE_X;
    root.position.y = BASE_Y;
    root.position.z = BASE_Z;
  }
  // root.position.z = 65;
  if (props.selectable) {
    selectableGroup.add(root);
  } else {
    scene.add(root);
  }
});
</script>

<style lang="scss" scoped></style>
