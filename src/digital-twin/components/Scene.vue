<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import Stats from "three/addons/libs/stats.module.js";
import * as THREE from "three";
import {
  CameraInjectKey,
  RendererInjectKey,
  RenderLoopInjectKey,
  SceneInjectKey,
  SelectableGroupInjectKey,
  WidthInjectKey,
  HeightInjectKey,
  HighlightedGroups,
  RegisterSelectHandler,
  ErrorDeviceGroups,
  ClosedDeviceGroups,
} from "./inject-keys";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";
import { GammaCorrectionShader } from "three/addons/shaders/GammaCorrectionShader.js";
import { LuminosityShader } from "three/addons/shaders/LuminosityShader.js";
import { SobelOperatorShader } from "three/addons/shaders/SobelOperatorShader.js";

import { useThree } from "./three";
import TWEEN from "@tweenjs/tween.js";

const props = defineProps({
  namespace: {
    type: String,
    default: "app",
  },
  background: {
    type: String,
  },
});

const { setScene, setControl } = useThree(props.namespace);
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

const emit = defineEmits(["object:selected", "object:unselected"]);

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

watch([widthRef, heightRef], (width, height) => {
  if (width && height) {
    createPostProcess();
  }
});

//注册选择事件
const selectEventHandlers = [];
provide(RegisterSelectHandler, function (func) {
  if (func && func instanceof Function) {
    selectEventHandlers.push(func);
  }
});

//选择部分
const selectedGroup = shallowRef([]);
provide(HighlightedGroups, selectedGroup);

//设备数据异常部分
const errorDeviceGroup = shallowRef([]);
provide(ErrorDeviceGroups, errorDeviceGroup);

//设备关闭部分
const closedDeviceGroup = shallowRef([]);
provide(ClosedDeviceGroups, closedDeviceGroup);

function createPostProcess() {
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
  //outline
  const outlinePass = new OutlinePass(
    new THREE.Vector2(width * pixelRatio, height * pixelRatio),
    scene,
    camera
  );

  const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 1.5, 0.4, 0.85);
  bloomPass.threshold = 0;
  bloomPass.strength = 0.2;
  bloomPass.radius = 0;
  // composer.addPass(bloomPass);

  //选择部分
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

  console.log(width, height, pixelRatio);
  effectFXAA.uniforms["resolution"].value.x = 1 / (width * pixelRatio);
  effectFXAA.uniforms["resolution"].value.y = 1 / (height * pixelRatio);
  // effectFXAA.uniforms["resolution"].value.set(
  //   1 / (width * pixelRatio),
  //   1 / (height * pixelRatio)
  // );
  composer.addPass(effectFXAA);

  //伽马校正
  const gammaCorrection = new ShaderPass(GammaCorrectionShader);
  composer.addPass(gammaCorrection);

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
}

function measure(func) {
  const before = new Date().getTime();
  func();
  const after = new Date().getTime();
  console.log("函数耗时:", after - before);
}

const loopFunc = [];
function registerLoopFunc(func) {
  loopFunc.push(func);
}
provide(RenderLoopInjectKey, registerLoopFunc);

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  loopFunc.forEach((func) => {
    func();
  });
  stats.begin();
  // controls.update();
  // renderer.render(scene, camera);
  composer.render();
  stats.end();
}
animate();
</script>

<style lang="scss" scoped></style>
