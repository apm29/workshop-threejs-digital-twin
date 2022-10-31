<template>
  <div ref="wrapper">
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { RendererInjectKey, WidthInjectKey, HeightInjectKey } from "./inject-keys";
import { useThree } from "./three";

const props = defineProps({
  namespace: {
    type: String,
    default: "app",
  },
});

const { setRenderer } = useThree(props.namespace);

const wrapper = ref();
const { width, height } = useElementSize(wrapper);
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
});
renderer.shadowMap.enabled = true;
onMounted(() => {
  // renderer.setClearColor(new THREE.Color());
  // renderer.setPixelRatio(Math.max(window.devicePixelRatio, 2));
  renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(width.value, height.value);
  renderer.outputEncoding = THREE.sRGBEncoding;
  wrapper.value.appendChild(renderer.domElement);
});
//监听视窗大小变化
watch([width, height], () => {
  renderer.setSize(width.value, height.value);
});

provide(RendererInjectKey, renderer);
provide(WidthInjectKey, width);
provide(HeightInjectKey, height);
setRenderer(renderer);
</script>

<style lang="scss" scoped></style>
