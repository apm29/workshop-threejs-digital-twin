<template>
  <Renderer>
    <Camera>
      <Scene>
        <AxesHelper></AxesHelper>
        <Sky></Sky>
        <Ground></Ground>
        <Light></Light>
        <!-- 工厂 -->
        <GltfModel path="./glb/其他.glb"></GltfModel>
        <SpriteLabel
          path="./sprite/3.png"
          :position="{
            x: 8,
            y: 5,
            z: -44.3,
          }"
        ></SpriteLabel>
        <GltfModel
          path="./glb/P1.glb"
          :position="{
            x: 7,
            z: -43,
          }"
          selectable
        ></GltfModel>
        <GltfModel
          path="./glb/P2.glb"
          :position="{
            x: 7,
            z: -45,
          }"
          selectable
        ></GltfModel>
        <GltfModel
          path="./glb/P3.glb"
          :position="{
            x: 7,
            z: -47,
          }"
          selectable
        ></GltfModel>
        <GltfModel
          path="./glb/P4.glb"
          :position="{
            x: 7.5,
            z: -49,
          }"
          selectable
        ></GltfModel>
        <GltfModel
          path="./glb/P5.glb"
          :position="{
            x: 9.6,
            z: -42.75,
            y: 6.7,
          }"
          selectable
        ></GltfModel>

        <!-- 后处理 -->
        <!-- <PostProcess></PostProcess> -->
      </Scene>
    </Camera>
  </Renderer>
</template>

<script setup>
import Renderer from "~/digital-twin/components/Renderer.vue";
import Scene from "~/digital-twin/components/Scene.vue";
import Camera from "~/digital-twin/components/Camera.vue";
import AxesHelper from "~/digital-twin/components/AxesHelper.vue";
import Sky from "~/digital-twin/components/Sky.vue";
import Light from "~/digital-twin/components/Light.vue";
import Ground from "~/digital-twin/components/Ground.vue";
// import PostProcess from '~/digital-twin/components/PostProcess.vue';
import GltfModel from "~/digital-twin/components/GltfModel.vue";
import SpriteLabel from "~/digital-twin/components/SpriteLabel.vue";
</script>

<style lang="scss" scoped></style>
