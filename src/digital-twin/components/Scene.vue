<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import Stats from "three/addons/libs/stats.module.js";
import * as THREE from "three";
import { CameraInjectKey, RendererInjectKey, RenderLoopInjectKey, SceneInjectKey, SelectableGroupInjectKey, WidthInjectKey, HeightInjectKey } from "./inject-keys"
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { OutlinePass } from "three/addons/postprocessing/OutlinePass.js";
import { useThree } from "./three";
const { setScene } = useThree()
const scene = new THREE.Scene()
//背景色
scene.background = new THREE.Color().setHSL(0.6, 0, 1)
//雾
scene.fog = new THREE.Fog(scene.background, 1, 5000)
//可选择得组
const group = new THREE.Group()
scene.add(group)

provide(SceneInjectKey, scene)
provide(SelectableGroupInjectKey, group)
setScene(scene)

const emit = defineEmits(["object:selected", "object:unselected"])

const renderer = inject(RendererInjectKey)
const camera = inject(CameraInjectKey)
const widthRef = inject(WidthInjectKey)
const heightRef = inject(HeightInjectKey)
//stats
const stats = new Stats();
window.document.body.appendChild(stats.dom);

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);
//outline
const outlinePass = new OutlinePass(new THREE.Vector2(widthRef.value, heightRef.valye), scene, camera)
outlinePass.visibleEdgeColor.set("#ff5500");
outlinePass.hiddenEdgeColor.set("#303030");
outlinePass.edgeStrength = 10;
outlinePass.edgeGlow = 0;
outlinePass.edgeThickness = 1;
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("/textures/tri_pattern.jpg");
outlinePass.patternTexture = texture;
outlinePass.usePatternTexture = true;
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
composer.addPass(outlinePass);

outlinePass.selectedObjects = []

//计算用射线
const raycaster = new THREE.Raycaster();
//记录鼠标位置
const mouse = new THREE.Vector2(-1000000, -100000);
//事件监听
renderer.domElement.addEventListener("click", onModelClick)
function onModelClick(event) {
  const width = widthRef.value;
  const height = heightRef.value;

  mouse.x = (event.clientX / width) * 2 - 1;
  mouse.y = -(event.clientY / height) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObject(group, true);
  if (intersects.length > 0) {
    const selectedObject = intersects[0].object;
    outlinePass.selectedObjects = [selectedObject];
    emit("object:selected", selectedObject)
  } else {
    outlinePass.selectedObjects = [];
    emit("object:unselected")
  }
}

//render-loop
const loopFunctions = []
function registerLoop(func) {
  if (func && func instanceof Function) {
    loopFunctions.push(func)
  }
}

provide(RenderLoopInjectKey, registerLoop)


function animate() {
  requestAnimationFrame(animate);

  stats.begin()
  // renderer.render(scene, camera);
  composer.render()
  stats.end()
}
onMounted(animate)
</script>

<style lang="scss" scoped>

</style>
