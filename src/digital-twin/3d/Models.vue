<template>
  <button fixed="~" top="6" right="6" @click="setCameraPosition">123</button>
</template>

<script setup>
import * as THREE from "three";
import { loadGTLFModel } from "./helpers/core.js";
import { makeLabel } from "./helpers/label.js";

const setCameraPosition = inject("setCameraPosition");

const getScene = inject("getScene");
const getSelectableGroup = inject("getSelectableGroup");
const getRenderer = inject("getRenderer");
const getCamera = inject("getCamera");
const getComposer = inject("getComposer");

const sceneRef = computed(getScene);
const selectableGroupRef = computed(getSelectableGroup);
const rendererRef = computed(getRenderer);
const cameraRef = computed(getCamera);
const composerRef = computed(getComposer);

const registerSceneReadyCallback = inject("registerSceneReadyCallback");
registerSceneReadyCallback(init);
let generated = false;
function init() {
  if (generated) {
    return;
  }
  const scene = sceneRef.value;
  const camera = cameraRef.value;
  const renderer = rendererRef.value;
  const selectableGroup = selectableGroupRef.value;
  const composer = composerRef.value;

  loadGTLFModel("/model/储料桶.glb").then((gltf) => {
    selectableGroup.add(gltf.scene);
    gltf.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.name = "储料桶";
      }
    });
    gltf.scene.position.x = 0.05;
    gltf.scene.position.y = 1;
    gltf.scene.position.z = 0.65;
    const text = makeLabel({}, "储料桶");
    scene.add(text);
  });

  loadGTLFModel("/model/给料槽.glb").then((gltf) => {
    selectableGroup.add(gltf.scene);
    gltf.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.name = "给料槽";
      }
    });
    gltf.scene.position.x = 5;
    gltf.scene.position.y = 0;
    const text = makeLabel({}, "给料槽");
    scene.add(text);
  });

  loadGTLFModel("/model/给料电机.glb").then((gltf) => {
    selectableGroup.add(gltf.scene);
    gltf.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.name = "给料电机";
      }
    });
    gltf.scene.position.x = 0;
    gltf.scene.position.y = 1;
    gltf.scene.position.z = -0.05;
    const text = makeLabel({}, "给料电机");
    scene.add(text);
  });
  loadGTLFModel("/model/给料螺旋.glb").then((gltf) => {
    selectableGroup.add(gltf.scene);
    gltf.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.name = "给料螺旋";
      }
    });
    gltf.scene.position.x = 0;
    gltf.scene.position.y = 0;
    const text = makeLabel({}, "给料螺旋");
    scene.add(text);
  });

  generated = true;
}
</script>

<style lang="scss" scoped></style>
