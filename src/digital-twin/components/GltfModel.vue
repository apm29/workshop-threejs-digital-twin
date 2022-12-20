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
  GltfLoaderKey,
  TextureLoaderKey,
} from "./inject-keys";
import { BASE_X, BASE_Y, BASE_Z } from "./axes.js";

const selectableGroup = inject(SelectableGroupInjectKey);
const scene = inject(SceneInjectKey);

const props = defineProps({
  path: {
    type: String,
    required: true,
  },
  name: {
    type: String,
  },
  //绑定模型的Object3D对象
  model: {
    type: Object,
  },
  selectable: {
    type: Boolean,
    default: false,
  },
  position: {
    type: Object,
  },
  rotation: {
    type: Object,
  },
  animateScale: {
    type: Number,
  },
});

const emit = defineEmits(["update:model"]);

const gltfLoader = inject(GltfLoaderKey);
const textureLoader = inject(TextureLoaderKey);

const model = ref();
const animationMixer = ref();

watch(() => props.path, loadModel, { immediate: true });
watch(
  () => props.animateScale,
  function (scale) {
    if (animationMixer.value) {
      animationMixer.value.timeScale = scale;
    }
  }
);

const parentContainer = computed(() => {
  return props.selectable ? selectableGroup : scene;
});

function loadModel() {
  unload();
  // console.log("load", props.path);
  gltfLoader.load(props.path, (gltf) => {
    const root = gltf.scene;
    model.value = root;
    emit("update:model", root);

    root.name = props.name;
    gltf.scene.traverse(function (obj) {
      if (obj instanceof THREE.Mesh) {
        obj.material.side = THREE.DoubleSide;
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
    if (gltf.animations && gltf.animations.length) {
      const mixer = new THREE.AnimationMixer(gltf.scene);
      animationMixer.value = mixer;
      const clock = new THREE.Clock();
      mixer.timeScale = props.animateScale ?? 1;
      function animate() {
        requestAnimationFrame(animate);
        const mixerUpdateDelta = clock.getDelta();
        mixer.update(mixerUpdateDelta);
      }
      const actions = gltf.animations.map((animation) => mixer.clipAction(animation));
      actions.forEach((action) => action.play());
      animate();
    }

    resetPosition();
    resetRotation();
    parentContainer.value?.add(root);
  });
}

function resetPosition() {
  const root = model.value
  //位置设置
  root.position.x = (props.position?.x ?? 0) + BASE_X;
  root.position.y = (props.position?.y ?? 0) + BASE_Y;
  root.position.z = (props.position?.z ?? 0) + BASE_Z;
}

function resetRotation() {
  const root = model.value
  //旋转设置
  root.rotation.x = props.rotation?.x ?? 0;
  root.rotation.y = props.rotation?.y ?? 0;
  root.rotation.z = props.rotation?.z ?? 0;
}

function unload() {
  if (model.value) {
    const root = model.value;
    parentContainer.value?.remove(root);
  }
}

onBeforeUnmount(unload);

watch(
  () => props.position,
  () => {
    if (model.value) {
     resetPosition()
    }
  },
  { deep: true }
);
watch(
  () => props.rotation,
  () => {
    if (model.value) {
     resetRotation()
    }
  },
  { deep: true }
);
</script>

<style lang="scss" scoped></style>
