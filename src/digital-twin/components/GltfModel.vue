<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { SceneInjectKey, SelectableGroupInjectKey } from "./inject-keys";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
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
  animateScale: {
    type: Number,
  },
});

const emit = defineEmits(["update:model"]);

const gltfLoader = new GLTFLoader();
const textureLoader = new THREE.TextureLoader();

const model = ref();
const animationMixer = ref();

watch(() => props.path, loadModel, { immediate: true });
watch(
  () => props.animateScale,
  function (scale) {
    console.log(props.path, scale);
    if (animationMixer.value) {
      animationMixer.value.timeScale = scale;
    }
  }
);

function loadModel() {
  unload();
  // console.log("load", props.path);
  gltfLoader.load(props.path, (gltf) => {
    const root = gltf.scene;
    model.value = root;
    // const wireframeMaterial = new THREE.MeshBasicMaterial({
    //   color: 0x5356ff,
    //   wireframe: true,
    //   transparent: true,
    // });
    emit("update:model", root);

    root.name = props.name;
    gltf.scene.traverse(function (obj) {
      if (obj instanceof THREE.Mesh) {
        const oldTexture = obj.material.map;
        const defaultMaterial = new THREE.MeshLambertMaterial({
          color: obj.material.color,
          map: oldTexture,
          // transparent: false,
        });
        // obj.material = defaultMaterial;
        // obj.material.map = oldTexture;

        obj.material.side = THREE.DoubleSide;
        obj.castShadow = true;
        obj.receiveShadow = true;
        //线框
        // const frameObj = new THREE.Mesh(obj.geometry, wireframeMaterial);
        // selectableGroup.add(frameObj)
      }
    });
    // console.log(props.path, gltf.scene);
    if (gltf.animations && gltf.animations.length) {
      const mixer = new THREE.AnimationMixer(gltf.scene);
      animationMixer.value = mixer;
      console.log(props.path, gltf.animations);
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

    root.position.x = (props.position?.x ?? 0) + BASE_X;
    root.position.y = (props.position?.y ?? 0) + BASE_Y;
    root.position.z = (props.position?.z ?? 0) + BASE_Z;

    if (props.selectable) {
      selectableGroup.add(root);
    } else {
      scene.add(root);
    }
  });
}

function unload() {
  if (model.value) {
    const root = model.value;
    if (props.selectable) {
      selectableGroup.remove(root);
    } else {
      scene.remove(root);
    }
  }
}

onBeforeUnmount(unload);

watch(
  () => props.position,
  () => {
    if (model.value) {
      const root = model.value;
      root.position.x = (props.position?.x ?? 0) + BASE_X;
      root.position.y = (props.position?.y ?? 0) + BASE_Y;
      root.position.z = (props.position?.z ?? 0) + BASE_Z;
    }
  },
  { deep: true }
);
</script>

<style lang="scss" scoped></style>
