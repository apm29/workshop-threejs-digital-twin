<template>
  <div h="screen" w="screen">
    <Renderer h="screen" w="screen">
      <Camera>
        <Scene @object:selected="handleSelect">
          <AxesHelper v-if="showAxesHelper"></AxesHelper>
          <Sky></Sky>
          <Ground></Ground>
          <Light></Light>
          <!-- 工厂 -->
          <GltfModel v-if="showOther" path="./glb/其他.glb"></GltfModel>
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
          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 8,
              y: 5,
              z: -46.3,
            }"
          ></SpriteLabel>
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

          <GltfModel
            path="./glb/犁刀机.glb"
            :position="{
              x: 10.5,
              z: -45,
              y: 2.4,
            }"
            selectable
          ></GltfModel>

          <GltfModel
            path="./glb/致密机.glb"
            :position="{
              x: 13.5,
              z: -46,
              y: 0,
            }"
            selectable
          ></GltfModel>

          <!-- 后处理 -->
          <!-- <PostProcess></PostProcess> -->
        </Scene>
      </Camera>
    </Renderer>
    <el-form
      fixed="!~"
      top="0"
      p="x-3 y-4"
      h="full"
      min="w-12rem"
      right="0"
      z="30"
      label-position="left"
      label-width="6rem"
      bg="gradient-to-r"
      from="transparent"
      to="dark-600"
    >
      <el-form-item label="显示坐标轴">
        <el-switch v-model="showAxesHelper"></el-switch>
      </el-form-item>
      <el-form-item label="显示建筑">
        <el-switch v-model="showOther"></el-switch>
      </el-form-item>
    </el-form>
  </div>
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

function handleSelect(object) {
  console.log(object);
}
const showOther = ref(true);
const showAxesHelper = ref(true);
</script>

<style lang="scss" scoped></style>
