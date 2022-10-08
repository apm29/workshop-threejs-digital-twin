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
import * as THREE from "three";
import { SceneInjectKey, SelectableGroupInjectKey, RenderLoopInjectKey, CameraInjectKey, RendererInjectKey, WidthInjectKey, HeightInjectKey } from "./inject-keys"

const renderer = inject(RendererInjectKey)
const camera = inject(CameraInjectKey)
const widthRef = inject(WidthInjectKey)
const heightRef = inject(HeightInjectKey)
const scene = inject(SceneInjectKey)
const selectableGroup = inject(SelectableGroupInjectKey)
const registerLoop = inject(RenderLoopInjectKey)

console.log(scene, camera);
const composer = new EffectComposer(renderer);
const effectFXAA = new ShaderPass(FXAAShader);
const renderPass = new RenderPass(scene, camera);

composer.addPass(renderPass);
composer.addPass(effectFXAA);

function handleSizeChange(width, height) {
  composer.setSize(width, height);
  effectFXAA.uniforms["resolution"].value.set(1 / width, 1 / height);
}

const emit = defineEmits(["object:selected", "object:unselected"])
registerLoop(function (scene) {
  // composer.render()
})

onMounted(() => {
  const width = widthRef.value;
  const height = heightRef.value;

  handleSizeChange(width, height);

  //outline
  const outlinePass = new OutlinePass(new THREE.Vector2(width, height), scene, camera)
  outlinePass.visibleEdgeColor.set("#ff5500");
  outlinePass.hiddenEdgeColor.set("#303030");
  outlinePass.edgeStrength = 10;
  outlinePass.edgeGlow = 0;
  outlinePass.edgeThickness = 1;
  composer.addPass(outlinePass);


  //选择材质
  const textureLoader = new THREE.TextureLoader();
  textureLoader.load("/textures/tri_pattern.jpg", function (texture) {
    outlinePass.patternTexture = texture;
    outlinePass.usePatternTexture = true;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  });

  //计算用射线
  const raycaster = new THREE.Raycaster();
  //记录鼠标位置
  const mouse = new THREE.Vector2();
  //事件监听
  renderer.domElement.addEventListener("click", onModelClick)

  function onModelClick(event) {
    mouse.x = (event.clientX / width) * 2 - 1;
    mouse.y = -(event.clientY / height) * 2 + 1;

    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObject(selectableGroup, true);
    if (intersects.length > 0) {
      const selectedObject = intersects[0].object;
      outlinePass.selectedObjects = [selectedObject];
      emit("object:selected", selectedObject)
    } else {
      outlinePass.selectedObjects = [];
      emit("object:unselected")
    }
  }
})

watch([heightRef, widthRef], (height, width) => {
  handleSizeChange(width, height);
})




</script>

<style lang="scss" scoped>

</style>
