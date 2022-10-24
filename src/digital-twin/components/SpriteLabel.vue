<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import {
  SceneInjectKey,
  SelectableGroupInjectKey,
  RenderLoopInjectKey,
} from "./inject-keys";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useModels } from "~/digital-twin/components/models.js";
const scene = inject(SceneInjectKey);
const selectableGroup = inject(SelectableGroupInjectKey);
const registerLoopFunc = inject(RenderLoopInjectKey);
const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  position: {
    type: Object,
  },
  size: {
    type: Number,
    default: 1,
  },
  viewData: {
    type: Object,
    default: () => ({}),
  },
});

const textureLoader = new THREE.TextureLoader();

const BASE_Z = 35;
const BASE_Y = 0;
const BASE_X = -5;

const texture = textureLoader.load(props.path);
const material = new THREE.SpriteMaterial({
  map: texture,
});
const label = new THREE.Sprite(material);
label.center.set(0.5, 1);
label.scale.set(props.size, props.size, 1);
if (props.position) {
  label.position.x = (props.position.x || 0) + BASE_X;
  label.position.y = (props.position.y || 0) + BASE_Y;
  label.position.z = (props.position.z || 0) + BASE_Z;
} else {
  label.position.x = BASE_X;
  label.position.y = BASE_Y;
  label.position.z = BASE_Z;
}
label.userData.viewData = props.viewData;
selectableGroup.add(label);
const oldY = label.position.y;
let down = true;
const clock = new THREE.Clock();
const downY = 0.2;
registerLoopFunc(() => {
  const delta = clock.getDelta();
  if (label.position.y <= oldY - downY) {
    down = false;
  } else if (label.position.y >= oldY) {
    down = true;
  }
  if (down) {
    label.position.y = clamp(label.position.y - downY * delta, oldY - downY, oldY);
  } else {
    label.position.y = clamp(label.position.y + downY * delta, oldY - downY, oldY);
  }
});

//注册模型数据和位置
const { registerModel } = useModels();
registerModel(label.userData.viewData, label.position);

watch(
  () => props.viewData,
  (viewData) => {
    label.userData.viewData = viewData;
  },
  { deep: true }
);

watch(
  () => props.position,
  () => {
    if (props.position) {
      label.position.x = (props.position.x || 0) + BASE_X;
      label.position.y = (props.position.y || 0) + BASE_Y;
      label.position.z = (props.position.z || 0) + BASE_Z;
    } else {
      label.position.x = BASE_X;
      label.position.y = BASE_Y;
      label.position.z = BASE_Z;
    }
  },
  { deep: true }
);

onBeforeUnmount(() => {
  selectableGroup.remove(label);
});

function clamp(value, min, max) {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}
</script>

<style lang="scss" scoped></style>
