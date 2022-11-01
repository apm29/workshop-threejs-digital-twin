<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import Stats from "three/addons/libs/stats.module.js";
import * as THREE from "three";
import {
  NameSpaceInjectKey,
  CameraInjectKey,
  RendererInjectKey,
  RenderLoopInjectKey,
  ComposerInjectKey,
  SceneInjectKey,
  SelectableGroupInjectKey,
  WidthInjectKey,
  HeightInjectKey,
} from "./inject-keys";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";

import { useThree } from "./three";
import TWEEN from "@tweenjs/tween.js";

const props = defineProps({
  background: {
    type: String,
  },
});

const namespace = inject(NameSpaceInjectKey)


const { setScene, setControl } = useThree(namespace);
const scene = new THREE.Scene();
if (props.background) {
  const textureLoader = new THREE.TextureLoader();
  scene.background = textureLoader.load(props.background);
}
//背景色
// scene.background = new THREE.Color().setHex(0x000000);
//雾
scene.fog = new THREE.Fog(new THREE.Color().setHex(0x000000), 1, 300);
//可选择得组
const group = new THREE.Group();
scene.add(group);

provide(SceneInjectKey, scene);
provide(SelectableGroupInjectKey, group);
setScene(scene);

const renderer = inject(RendererInjectKey);
const camera = inject(CameraInjectKey);
const widthRef = inject(WidthInjectKey);
const heightRef = inject(HeightInjectKey);
//stats
const stats = new Stats();
// 设置监视器面板，传入面板id（0: fps, 1: ms, 2: mb）
stats.setMode(0);
window.document.body.appendChild(stats.dom);
stats.dom.style.top = "70px";

const composer = new EffectComposer(renderer);
provide(ComposerInjectKey, composer);

const loopFunc = [];
function registerLoopFunc(func) {
  loopFunc.push(func);
}
provide(RenderLoopInjectKey, registerLoopFunc);

function animate() {
  requestAnimationFrame(animate);
  stats.begin();
  TWEEN.update();
  loopFunc.forEach((func) => {
    func();
  });
  // controls.update();
  // renderer.render(scene, camera);
  // composer.render();
  if (composer.passes.length >= 1) {
    composer.render();
  } else {
    renderer.render(scene, camera);
  }
  stats.end();
}
console.log("SCENE CREATED");

animate();
</script>

<style lang="scss" scoped></style>
