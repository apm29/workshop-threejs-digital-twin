<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { SceneInjectKey, SelectableGroupInjectKey } from "./inject-keys";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { BASE_X, BASE_Y, BASE_Z } from "./axes.js"


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
const textureLoader = new THREE.TextureLoader();

const model = ref();
gltfLoader.load(props.path, (gltf) => {
  const root = gltf.scene;
  model.value = root;
  // const wireframeMaterial = new THREE.MeshBasicMaterial({
  //   color: 0x5356ff,
  //   wireframe: true,
  //   transparent: true,
  // });

  gltf.scene.traverse(function (obj) {
    if (obj instanceof THREE.Mesh) {
      // console.log(obj);
      const defaultMaterial = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        // transparent: false,
      });
      obj.material = defaultMaterial;
      // obj.material.side = THREE.DoubleSide;
      obj.castShadow = true;
      obj.receiveShadow = true;
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

  if (props.selectable) {
    selectableGroup.add(root);
  } else {
    scene.add(root);
  }
});

onBeforeUnmount(() => {
  if (model.value) {
    const root = model.value;
    if (props.selectable) {
      selectableGroup.remove(root);
    } else {
      scene.remove(root);
    }
  }
});

watch(
  () => props.position,
  () => {
    if (model.value) {
      const root = model.value;
      if (props.position) {
        root.position.x = (props.position.x || 0) + BASE_X;
        root.position.y = (props.position.y || 0) + BASE_Y;
        root.position.z = (props.position.z || 0) + BASE_Z;
      } else {
        root.position.x = BASE_X;
        root.position.y = BASE_Y;
        root.position.z = BASE_Z;
      }
    }
  },
  { deep: true }
);
</script>

<style lang="scss" scoped></style>
