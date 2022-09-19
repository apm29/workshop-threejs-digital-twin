<template>
  <div ref="sceneWrapper" class="3d-scene" h="full" w="full">
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import Stats from "three/addons/libs/stats.module.js";

import {
  createScene,
  createCamera,
  createRenderer,
  createAxesHelper,
  createLight,
  createGround,
  createSky,
  createControl,
  createPostProcess,
  mountSelectListener,
  loadGTLFModel,
} from "./helpers/core.js";
import { makeLabel } from "./helpers/label.js";
//容器
const sceneWrapper = ref();
//获取容器宽高
const { width: wrapperWidth, height: wrapperHeight } = useElementSize(sceneWrapper);

const cameraRef = ref();
const sceneRef = ref();
const rendererRef = ref();
const selectableGroupRef = ref();
const composerRef = ref();
const effectFXAARef = ref();

provide("getCamera", () => cameraRef.value);
provide("getScene", () => sceneRef.value);
provide("getRenderer", () => rendererRef.value);
provide("getSelectableGroup", () => selectableGroupRef.value);
provide("getComposer", () => composerRef.value);
provide("getEffectFXAA", () => effectFXAARef.value);

const emit = defineEmits(["object:selected"]);

const sceneCreatedListeners = [];
provide("registerSceneReadyCallback", function (callback) {
  if (
    callback &&
    callback instanceof Function &&
    sceneCreatedListeners.indexOf(callback) < 0
  ) {
    sceneCreatedListeners.push(callback);
    if (generated) {
      callback();
    }
  }
});

let generated = false;

//等元素挂载后,获取宽高完成时,生成scene,camera
function generateSceneAndCamera(height, width) {
  const scene = createScene();

  const camera = createCamera(height, width);

  const renderer = createRenderer(height, width);

  //挂载到页面
  sceneWrapper.value.appendChild(renderer.domElement);

  //显示坐标轴
  createAxesHelper(scene);

  //光照
  createLight(scene);

  //地面
  createGround(scene);

  //SKY;
  createSky(scene);

  //CONTROL
  const { controls } = createControl(camera, renderer.domElement);

  //stats
  const stats = new Stats();
  sceneWrapper.value.appendChild(stats.dom);

  //后处理
  const { composer, effectFXAA } = createPostProcess(
    scene,
    camera,
    renderer,
    height,
    width
  );
  //事件处理

  const { selectableGroup } = mountSelectListener(
    scene,
    camera,
    renderer,
    composer,
    height,
    width,
    emit
  );
  sceneRef.value = scene;
  cameraRef.value = camera;
  rendererRef.value = renderer;
  selectableGroupRef.value = selectableGroup;
  composerRef.value = composer;
  effectFXAARef.value = effectFXAA;
  generated = true;
  //触发场景生成完成的回调
  sceneCreatedListeners.forEach((callback) => callback());

  function animate() {
    requestAnimationFrame(animate);
    stats.begin();
    renderer.render(scene, camera);
    controls.update();
    composer.render();
    stats.end();
  }
  animate();
}

//宽高变化
function handleResizeWrapper() {
  const width = wrapperWidth.value;
  const height = wrapperHeight.value;
  const camera = cameraRef.value;
  const renderer = rendererRef.value;
  const composer = composerRef.value;
  const effectFXAA = effectFXAARef.value;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);
  composer.setSize(width, height);

  effectFXAA.uniforms["resolution"].value.set(1 / width, 1 / height);
}

const throttledResize = useDebounceFn(handleResizeWrapper, 500);
//监听宽高
watch([wrapperHeight, wrapperWidth], ([height, width]) => {
  if (height && width) {
    if (!generated) {
      generateSceneAndCamera(height, width);
    } else {
      throttledResize();
    }
  }
});

//摄像机
function setCameraPosition() {
  const camera = cameraRef.value;
  camera.position.x = 30;
  camera.position.y = 30;
  camera.position.z = 50;
}
provide("setCameraPosition", setCameraPosition);
</script>

<style lang="scss" scoped></style>
