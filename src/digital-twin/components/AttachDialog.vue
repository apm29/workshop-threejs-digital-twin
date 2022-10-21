<template>
  <div
    class="attach-dialog"
    absolute="~"
    z="100"
    :style="{
      left: `${screenVector.x - width / 2 + screenProjectWidth / 2}px`,
      top: `${screenVector.y - height}px`,
    }"
    w="100"
    h="80"
    bg="red-500"
    ref="dialog"
  >
    <slot>
      {{ screenProjectWidth }}
    </slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { CameraInjectKey, WidthInjectKey, HeightInjectKey } from "./inject-keys";

const widthRef = inject(WidthInjectKey);
const heightRef = inject(HeightInjectKey);
const camera = inject(CameraInjectKey);

const dialog = ref();

const { width, height } = useElementSize(dialog);

const props = defineProps({
  attach: {
    type: Object,
  },
  size: {
    type: Object,
    default: () => {
      return {
        height: 1,
        width: 1,
        depth: 1,
      };
    },
  },
});

//视图中心点坐标
const viewCenter = computed(() => {
  return {
    x: widthRef.value / 2,
    y: heightRef.value / 2,
  };
});
//世界坐标系(x,y,z)
const worldVector = computed(() => {
  return new THREE.Vector3(props.attach.x, props.attach.y, props.attach.z);
});
const worldVector2 = computed(() => {
  return new THREE.Vector3(
    props.attach.x + props.size.width / 2,
    props.attach.y + props.size.height / 2,
    props.attach.z + props.size.depth / 2
  );
});

const objWidth = computed(() => {
  const vectorObj2Cam = new THREE.Vector3(
    camera.position.x - props.attach.x,
    camera.position.y - props.attach.y,
    camera.position.z - props.attach.z
  );
  return vectorObj2Cam;
});
//标准坐标系(以屏幕中心为原点,归化x,y到[-1,1]区间的坐标)
const standartVector = computed(() => {
  return worldVector.value.project(camera);
});
const standartVector2 = computed(() => {
  return worldVector2.value.project(camera);
});

//屏幕坐标系
const screenVector = computed(() => {
  return {
    x: Math.round(viewCenter.value.x * standartVector.value.x + viewCenter.value.x),
    y: Math.round(-1 * viewCenter.value.y * standartVector.value.y + viewCenter.value.y),
  };
});
const screenVector2 = computed(() => {
  return {
    x: Math.round(viewCenter.value.x * standartVector2.value.x + viewCenter.value.x),
    y: Math.round(-1 * viewCenter.value.y * standartVector2.value.y + viewCenter.value.y),
  };
});

//计算屏幕上投影的宽度
const screenProjectWidth = computed(() => {
  return Math.sqrt(
    Math.pow(screenVector2.value.x - screenVector.value.x, 2) +
      Math.pow(screenVector2.value.y - screenVector.value.y, 2)
  );
});
</script>

<style lang="scss" scoped></style>
