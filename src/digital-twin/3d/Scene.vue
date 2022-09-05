<template>
  <div ref="sceneWrapper" class="3d-scene" h="full" w="full">
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";

//容器
const sceneWrapper = ref();
//获取容器宽高
const { width, height } = useElementSize(sceneWrapper);

const scene = ref();
const camera = ref();
const renderer = ref();

//外部参数
const props = defineProps({
  fov: {
    type: Number,
    default: 75,
  },
  near: {
    type: Number,
    default: 0.1,
  },
  far: {
    type: Number,
    default: 2000,
  },
});

const { fov, near, far } = toRefs(props);

//等元素挂载后,获取宽高完成时,生成scene,camera
function generateSceneAndCamera() {
  const wrapper = unref(sceneWrapper);
  //创建场景
  scene.value = new THREE.Scene();
  //创建相机
  camera.value = new THREE.PerspectiveCamera(
    fov.value, //视野角度FOV
    width.value / height.value, //长宽比 aspect ratio
    near.value, //近截面
    far.value //远截面
  );

  //创建渲染器
  const webGlRender = new THREE.WebGLRenderer();
  //设置渲染范围
  webGlRender.setSize(width.value, height.value);
  //将渲染元素挂载到wrapper
  wrapper.appendChild(webGlRender.domElement);
  renderer.value = webGlRender;
}
//监听宽高
watch([height, width], ([height, width]) => {
  if (height && width) {
    generateSceneAndCamera();
  }
});

//为子元素提供
provide("getScene", () => scene.value);
provide("getCamera", () => camera.value);
provide("getRenderer", () => renderer.value);
</script>

<style lang="scss" scoped></style>
