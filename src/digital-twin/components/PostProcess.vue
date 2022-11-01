<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { GammaCorrectionShader } from "three/addons/shaders/GammaCorrectionShader.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { LuminosityShader } from "three/addons/shaders/LuminosityShader.js";
import { SobelOperatorShader } from "three/addons/shaders/SobelOperatorShader.js";

import * as THREE from "three";
import {
  SceneInjectKey,
  SelectableGroupInjectKey,
  CameraInjectKey,
  RendererInjectKey,
  WidthInjectKey,
  HeightInjectKey,
  ComposerInjectKey,
  HighlightedGroups,
  ErrorDeviceGroups,
  ClosedDeviceGroups,
  RegisterSelectHandler,
} from "./inject-keys";

const renderer = inject(RendererInjectKey);
const camera = inject(CameraInjectKey);
const composer = inject(ComposerInjectKey);
const widthRef = inject(WidthInjectKey);
const heightRef = inject(HeightInjectKey);
const scene = inject(SceneInjectKey);
const group = inject(SelectableGroupInjectKey);

//选择部分
const selectedGroup = shallowRef([]);
provide(HighlightedGroups, selectedGroup);

//设备数据异常部分
const errorDeviceGroup = shallowRef([]);
provide(ErrorDeviceGroups, errorDeviceGroup);

//设备关闭部分
const closedDeviceGroup = shallowRef([]);
provide(ClosedDeviceGroups, closedDeviceGroup);

function handleSizeChange(width, height) {
  composer.setSize(width, height);
  outlinePass.setSize(width, height);
  errorDeviceOutlinePass.setSize(width, height);
  closedDeviceOutlinePass.setSize(width, height);
  effectFXAA.uniforms["resolution"].value.set(1 / width, 1 / height);
}

const emit = defineEmits(["object:selected", "object:unselected"]);

watch([heightRef, widthRef], ([height, width]) => {
  console.log("PASS SIZE", height, width);
  if (height && width) {
    handleSizeChange(width, height);
  }
});

const width = widthRef.value;
const height = heightRef.value;
const pixelRatio = renderer.getPixelRatio();
const renderPass = new RenderPass(scene, camera);
renderPass.clear = true;
composer.addPass(renderPass);
composer.setSize(width, height);

const filmPass = new FilmPass(
  0.35, // noise intensity
  0.025, // scanline intensity
  648, // scanline count
  false // grayscale
);
filmPass.renderToScreen = true;
// composer.addPass(filmPass);

const effectGrayScale = new ShaderPass(LuminosityShader);
// composer.addPass(effectGrayScale);

const effectSobel = new ShaderPass(SobelOperatorShader);
effectSobel.uniforms["resolution"].value.x = width * pixelRatio;
effectSobel.uniforms["resolution"].value.y = height * pixelRatio;
// composer.addPass(effectSobel);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85);
bloomPass.threshold = 0;
bloomPass.strength = 0.2;
bloomPass.radius = 0;
// composer.addPass(bloomPass);

//选择部分
//outline
const outlinePass = new OutlinePass(
  new THREE.Vector2(width * pixelRatio, height * pixelRatio),
  scene,
  camera
);

//注册选择事件
const selectEventHandlers = [];
provide(RegisterSelectHandler, function (func) {
  if (func && func instanceof Function) {
    selectEventHandlers.push(func);
  }
});

watch(selectedGroup, (selected) => {
  outlinePass.selectedObjects = selected;
});

outlinePass.visibleEdgeColor.set("#33ff44");
outlinePass.hiddenEdgeColor.set("#33ff44");
outlinePass.edgeStrength = 10;
outlinePass.edgeGlow = 0.5;
outlinePass.edgeThickness = 1;
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./textures/tri_pattern.jpg");
outlinePass.patternTexture = texture;
outlinePass.usePatternTexture = false;
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
outlinePass.renderToScreen = true;
outlinePass.selectedObjects = [];
composer.addPass(outlinePass);

//设备数据错误
const errorDeviceOutlinePass = new OutlinePass(
  new THREE.Vector2(width * pixelRatio, height * pixelRatio),
  scene,
  camera
);
const errorTexture = textureLoader.load("./textures/data_error.jpg");
errorTexture.wrapS = THREE.RepeatWrapping;
errorTexture.wrapT = THREE.RepeatWrapping;
errorDeviceOutlinePass.patternTexture = errorTexture;
errorDeviceOutlinePass.usePatternTexture = false;
watch(errorDeviceGroup, (selected) => {
  console.log("error", selected);
  errorDeviceOutlinePass.selectedObjects = selected;
});

errorDeviceOutlinePass.visibleEdgeColor.set("#ff0000");
errorDeviceOutlinePass.hiddenEdgeColor.set("#ff0000");
errorDeviceOutlinePass.edgeStrength = 10;
errorDeviceOutlinePass.edgeGlow = 0;
errorDeviceOutlinePass.edgeThickness = 1;
errorDeviceOutlinePass.renderToScreen = true;
errorDeviceOutlinePass.selectedObjects = [];
composer.addPass(errorDeviceOutlinePass);

//设备关闭
const closedDeviceOutlinePass = new OutlinePass(
  new THREE.Vector2(width * pixelRatio, height * pixelRatio),
  scene,
  camera
);

const closeTexture = textureLoader.load("./textures/device_close.jpg");
closeTexture.wrapS = THREE.RepeatWrapping;
closeTexture.wrapT = THREE.RepeatWrapping;
closedDeviceOutlinePass.patternTexture = closeTexture;
closedDeviceOutlinePass.usePatternTexture = false;

watch(closedDeviceGroup, (selected) => {
  closedDeviceOutlinePass.selectedObjects = selected;
});

closedDeviceOutlinePass.visibleEdgeColor.set("#0022ff");
closedDeviceOutlinePass.hiddenEdgeColor.set("#0022ff");
closedDeviceOutlinePass.edgeStrength = 10;
closedDeviceOutlinePass.edgeGlow = 0;
closedDeviceOutlinePass.edgeThickness = 1;
closedDeviceOutlinePass.renderToScreen = true;
closedDeviceOutlinePass.selectedObjects = [];
composer.addPass(closedDeviceOutlinePass);

//抗锯齿
const effectFXAA = new ShaderPass(FXAAShader);

effectFXAA.uniforms["resolution"].value.x = 1 / width;
effectFXAA.uniforms["resolution"].value.y = 1 / height;
// effectFXAA.uniforms["resolution"].value.set(
//   1 / (width * pixelRatio),
//   1 / (height * pixelRatio)
// );
composer.addPass(effectFXAA);

//伽马校正
const gammaCorrection = new ShaderPass(GammaCorrectionShader);
composer.addPass(gammaCorrection);

console.log("PASS CREATED");

//计算用射线
const raycaster = new THREE.Raycaster();
//记录鼠标位置
const mouse = new THREE.Vector2(-1000000, -100000);
//事件监听
renderer.domElement.style.touchAction = "none";
renderer.domElement.addEventListener("click", onModelClick);
function onModelClick(event) {
  const width = widthRef.value;
  const height = heightRef.value;

  mouse.x = (event.clientX / width) * 2 - 1;
  mouse.y = -(event.clientY / height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(group, true);
  if (intersects.length > 0) {
    const selectedObject = intersects[0].object;
    // outlinePass.selectedObjects = [selectedObject];
    emit("object:selected", {
      event,
      camera,
      renderer,
      scene,
      selectedObject,
    });
    selectEventHandlers.forEach((func) => {
      func({
        event,
        camera,
        renderer,
        scene,
        selectedObject,
      });
    });
  } else {
    // outlinePass.selectedObjects = [];
    emit("object:unselected");
  }
}
</script>

<style lang="scss" scoped></style>
