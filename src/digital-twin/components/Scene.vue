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
  OrbitControlInjectKey,
  HighlightedGroups,
  RegisterSelectHandler,
} from "./inject-keys";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import { FilmPass } from "three/addons/postprocessing/FilmPass.js";
import { GammaCorrectionShader } from "three/addons/shaders/GammaCorrectionShader.js";
import { useThree } from "./three";
import TWEEN from "@tweenjs/tween.js";

const { setScene, setControl } = useThree();
const scene = new THREE.Scene();
//背景色
scene.background = new THREE.Color().setHex(0x000000);
//雾
scene.fog = new THREE.Fog(scene.background, 1, 300);
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
stats.setMode(1);
window.document.body.appendChild(stats.dom);

const composer = new EffectComposer(renderer);

watch([widthRef, heightRef], (width, height) => {
  if (width && height) {
    initOutlinePass();
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

function initOutlinePass() {
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

  //outline
  const outlinePass = new OutlinePass(
    new THREE.Vector2(width * pixelRatio, height * pixelRatio),
    scene,
    camera
  );
  //选择部分
  watch(selectedGroup, (selected) => {
    outlinePass.selectedObjects = selected;
  });

  outlinePass.visibleEdgeColor.set("#0022ff");
  outlinePass.hiddenEdgeColor.set("#ff3366");
  outlinePass.edgeStrength = 30;
  outlinePass.edgeGlow = 1;
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
        controls,
      });
      selectEventHandlers.forEach((func) => {
        func({
          event,
          camera,
          renderer,
          scene,
          selectedObject,
          controls,
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

//control
const controls = new OrbitControls(camera, renderer.domElement);
controls.listenToKeyEvents(window); // optional
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 0.1;
controls.maxDistance = 100;
controls.maxPolarAngle = (Math.PI / 2) * 1.5;
setControl(controls);
provide(OrbitControlInjectKey, controls);

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
  controls.update();
  // renderer.render(scene, camera);
  composer.render();
  stats.end();
}
animate();
</script>

<style lang="scss" scoped></style>
