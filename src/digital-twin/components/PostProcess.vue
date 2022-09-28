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
import { FXAAShader } from "three/addons/shaders/FXAAShader.js";
import * as THREE from "three";
import { SceneInjectKey, CameraInjectKey, RendererInjectKey, WidthInjectKey, HeightInjectKey } from "./inject-keys"

const renderer = inject(RendererInjectKey)
const camera = inject(CameraInjectKey)
const widthRef = inject(WidthInjectKey)
const heightRef = inject(HeightInjectKey)
const scene = inject(SceneInjectKey)

const composer = new EffectComposer(renderer);
const effectFXAA = new ShaderPass(FXAAShader);
const renderPass = new RenderPass(scene, camera);

composer.addPass(renderPass);
composer.addPass(effectFXAA);

function handleSizeChange(width, height) {
  composer.setSize(width, height);
  effectFXAA.uniforms["resolution"].value.set(1 / width, 1 / height);
}
onMounted(() => {
  const width = widthRef.value;
  const height = heightRef.value;

  handleSizeChange(width, height);
})

watch([heightRef, widthRef], (height, width) => {
  handleSizeChange(width, height);
})

</script>

<style lang="scss" scoped>

</style>
