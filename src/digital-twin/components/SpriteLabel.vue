<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import {
  SelectableGroupInjectKey,
  RenderLoopInjectKey,
  RegisterSelectHandler,
  TextureLoaderKey,
} from "./inject-keys";
import { useModels } from "~/digital-twin/components/models.js";
import { BASE_X, BASE_Y, BASE_Z } from "./axes.js";

const selectableGroup = inject(SelectableGroupInjectKey);
const registerLoopFunc = inject(RenderLoopInjectKey);
const selectHandler = inject(RegisterSelectHandler);
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
const emit = defineEmits(["click"]);

const textureLoader = inject(TextureLoaderKey);

const texture = textureLoader.load(props.path);
const material = new THREE.SpriteMaterial({
  map: texture,
  transparent: true,
});
const label = new THREE.Sprite(material);
label.center.set(0.5, 1);
label.scale.set(props.size, props.size, 1);
resetPosition();
label.userData.viewData = props.viewData;
selectableGroup.add(label);

watch(() => props.position, resetPosition, { deep: true });

function resetPosition() {
  label.position.x = (props.position?.x ?? 0) + BASE_X;
  label.position.y = (props.position?.y ?? 0) + BASE_Y;
  label.position.z = (props.position?.z ?? 0) + BASE_Z;
}

// const oldY = label.position.y;
// let down = true;
// const clock = new THREE.Clock();
// const downY = 0.2;
// registerLoopFunc(() => {
//   const delta = clock.getDelta();
//   if (label.position.y <= oldY - downY) {
//     down = false;
//   } else if (label.position.y >= oldY) {
//     down = true;
//   }
//   if (down) {
//     label.position.y = clamp(label.position.y - downY * delta, oldY - downY, oldY);
//   } else {
//     label.position.y = clamp(label.position.y + downY * delta, oldY - downY, oldY);
//   }
// });

const oldCenterY = label.center.y;
let down = true;
const clock = new THREE.Clock();
const downY = 0.2;
registerLoopFunc(() => {
  const delta = clock.getDelta();
  if (label.center.y <= oldCenterY - downY) {
    down = false;
  } else if (label.center.y >= oldCenterY) {
    down = true;
  }
  if (down) {
    label.center.y = clamp(
      label.center.y - downY * delta,
      oldCenterY - downY,
      oldCenterY
    );
    label.position.y -= 0.001;
  } else {
    label.center.y = clamp(
      label.center.y + downY * delta,
      oldCenterY - downY,
      oldCenterY
    );
    label.position.y += 0.001;
  }
});
//??????????????????
selectHandler(({ event, camera, renderer, scene, selectedObject }) => {
  if (selectedObject === label) {
    console.log("SELECTED!");
    emit("click", {
      event,
      camera,
      renderer,
      scene,
      selectedObject,
    });
  }
});

//???????????????????????????
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
    label.position.x = (props.position?.x ?? 0) + BASE_X;
    label.position.y = (props.position?.y ?? 0) + BASE_Y;
    label.position.z = (props.position?.z ?? 0) + BASE_Z;
  },
  { deep: true }
);
//????????????
watch(
  () => props.path,
  (path) => {
    const texture = textureLoader.load(path);
    label.material.map = texture;
  }
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
