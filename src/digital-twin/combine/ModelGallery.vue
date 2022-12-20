<template>
  <SimpleBorder6 w="48" h="100" p="2">
    <NameSpace h="full" w="full" class="bg-network" namespace="demo">
      <LoadingManagerProvider>
        <Renderer h="full" w="full">
          <Camera :position="cameraPosition">
            <Scene>
              <Controls auto-rotate></Controls>
              <Light></Light>
              <!-- <AxesHelper></AxesHelper> -->

              <GltfModel
                :path="modelPath"
                :position="{
                  x: -BASE_X,
                  y: -BASE_Y,
                  z: -BASE_Z,
                }"
              >
              </GltfModel>
            </Scene>
          </Camera>
        </Renderer>
      </LoadingManagerProvider>
    </NameSpace>
  </SimpleBorder6>
</template>

<script setup>
import NameSpace from "~/digital-twin/components/NameSpace.vue";
import Renderer from "~/digital-twin/components/Renderer.vue";
import Scene from "~/digital-twin/components/Scene.vue";
import Camera from "~/digital-twin/components/Camera.vue";
import Controls from "~/digital-twin/components/Controls.vue";
import SimpleBorder6 from "~/svg/border/SimpleBorder6.vue";
import GltfModel from "~/digital-twin/components/GltfModel.vue";
import Light from "~/digital-twin/components/Light.vue";
import { BASE_X, BASE_Y, BASE_Z } from "~/digital-twin/components/axes.js";
import AxesHelper from "~/digital-twin/components/AxesHelper.vue";
import LoadingManagerProvider from "../components/LoadingManagerProvider.vue";

defineProps({
  cameraPosition: {
    type: Object,
    default: () => ({
      x: 1,
      y: 0.5,
      z: 1,
    }),
  },
  modelPath: {
    type: String,
    default: "./glb/电机.glb",
  },
});
</script>

<style lang="scss" scoped>
.bg-network {
  background-image: url("./textures/model_bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
