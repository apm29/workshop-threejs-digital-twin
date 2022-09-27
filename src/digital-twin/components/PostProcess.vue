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

onMounted(() => {
  const width = widthRef.value;
  const height = heightRef.value;
  const composer = new EffectComposer(renderer);
  composer.setSize(width, height);
  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const effectFXAA = new ShaderPass(FXAAShader);
  effectFXAA.uniforms["resolution"].value.set(1 / width, 1 / height);
  composer.addPass(effectFXAA);
})

</script>

<style lang="scss" scoped>

</style>
