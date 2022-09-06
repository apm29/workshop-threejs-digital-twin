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

const emit = defineEmits(["object:selected"]);

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

  loadGTLFModel("/model/回转窑-20220904.glb").then((gltf) => {
    selectableGroup.add(gltf.scene);
    gltf.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.name = "回转窑";
      }
    });
    const text = makeLabel(
      {
        x: 1,
        y: 5,
        z: -15,
      },
      "回转窑"
    );
    scene.add(text);
  });
  loadGTLFModel("/model/窑尾箱-20220904.glb").then((gltf) => {
    selectableGroup.add(gltf.scene);
    gltf.scene.position.z = 10;
    gltf.scene.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true;
        child.name = "窑尾箱";
      }
    });
    const text = makeLabel(
      {
        x: 1,
        y: 5,
        z: 10,
      },
      "窑尾箱"
    );
    scene.add(text);
  });

  sceneRef.value = scene;
  cameraRef.value = camera;
  rendererRef.value = renderer;
  selectableGroupRef.value = selectableGroup;
  composerRef.value = composer;
  effectFXAARef.value = effectFXAA;
  generated = true;

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
</script>

<style lang="scss" scoped></style>
