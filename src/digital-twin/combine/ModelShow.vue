<template>
  <SimpleBorder6 w="48" h="full" p="2">
    <div h="full" w="full" class="bg-network">
      <Renderer h="full" w="full" namespace="demo">
        <Camera
          namespace="demo"
          :position="{
            x: 1,
            y: 0.5,
            z: 1,
          }"
        >
          <Scene namespace="demo">
            <Light></Light>
            <!-- <AxesHelper></AxesHelper> -->
            <GltfModel
              path="./glb/电机.glb"
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
    </div>
  </SimpleBorder6>
</template>

<script setup>
import Renderer from "~/digital-twin/components/Renderer.vue";
import Scene from "~/digital-twin/components/Scene.vue";
import Camera from "~/digital-twin/components/Camera.vue";
import SimpleBorder6 from "~/svg/border/SimpleBorder6.vue";
import GltfModel from "~/digital-twin/components/GltfModel.vue";
import Light from "~/digital-twin/components/Light.vue";
import { BASE_X, BASE_Y, BASE_Z } from "~/digital-twin/components/axes.js";
import AxesHelper from "~/digital-twin/components/AxesHelper.vue";
</script>

<style lang="scss" scoped>
.bg-network {
  background-image: url("./textures/model_bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
</style>
