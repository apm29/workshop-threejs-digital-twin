<template>
  <div
    class="attach-dialog-wrapper"
    :style="{
      left: `${screenVector.x - width / 2 + screenProjectWidth / 2}px`,
      top: `${Math.max(screenVector.y - height - 30, 0)}px`,
    }"
    ref="dialog"
    absolute="~"
    z="100"
  >
    <slot>
      测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试
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

<style lang="scss" scoped>
// .attach-dialog {
//   background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOsAAABKCAYAAABaSqOeAAADIklEQVR4nO3ZXW7rNhCG4W+Gln/qZgFdczfQdbYnjRObmmIoOidtryNggPcBCNmAAV0IL4aU7bc/4nf9X4/Qh6R1LgDfz3OZ6Sip/fduh399C91CepvXu6QHsQK78dFkaJHpbNIlr8+bf8YaoVeF/grpNUI3hd4z1ghiBfZgtsUappNpRHqV9GI2rjPWLc4M9c9Y9SNCb5Gxhu7BZAV2YTlZTYuZTjJd5OoW484tJ+yINbe+Y6Juof5YV/0dq25BrMBubDuvLuY6u6uP8nycXcekzVj7OKNu622G+rp23dZV9wh1Hhfw/czU3LW41EenGWqMUG8y9UO+9R0vk0LvufXNiZqh9m3d106swB68qbW29eZSC9PRskkbfX4c5tvex1gxJuk9J2qG+vjQe+9sg4E9tCbPP21ywpqPQO+fbUrrM9Y13/rm+TS2zz0naobaH0xWYC/e1aOpf2lxtdmo8xSAGogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSIOM1g3k5vmMjVvaq0RM7CX7C27y/6+tOjPRp+xHsYyLWZa3LW0pq6j5F2dpwV8vzkgR3/ZYfb42WbGaqajQkuYTpbLdXZtgWbh0YgV2MPY0boWbzpnh9mjskmNeI9ZbJPpbNJZpou7+rqN22aue0grTwr4fnPbu4yB6frFTBez0eU5O81Y80cXSVe5eqbprhbbxCVWYCcZ6zyKnkaorl9Nus4+x15Ys9wXizFSm0InC71LekQQK7CH+TLpoC3W3O1eZXqZfc5Ytx9ex5ZYY498C9M9YzUmK7CXEWueUefR9PIMVV9jHX6eXbtCH9pCJVZgH8+/UY9zcP4k6R+4wfHJKSQgnwAAAABJRU5ErkJggg==")
//     no-repeat;
//   background-size: 100% 100%;
// }
// .attach-dialog-wrapper {
//   background: #134857;
//   background-size: 100% 100%;
// }
</style>
