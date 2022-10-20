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
          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 8,
              y: 5,
              z: -48.3,
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/P3.glb"
            :position="{
              x: 7,
              z: -47,
            }"
            selectable
          ></GltfModel>
          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 8.5,
              y: 5,
              z: -50.3,
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/P4.glb"
            :position="{
              x: 7.5,
              z: -49,
            }"
            selectable
          ></GltfModel>
          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 11.5,
              y: 10,
              z: -46.75,
            }"
          ></SpriteLabel>
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
import * as THREE from "three";
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
import TWEEN from "@tweenjs/tween.js";

function handleSelect({ event, selectedObject, camera, controls }) {
  if (!(selectedObject instanceof THREE.Sprite)) {
    return;
  }
  //向量计算
  //物体位置--> 相机位置向量
  const vector = new THREE.Vector3(
    camera.position.x - selectedObject.position.x,
    camera.position.y - selectedObject.position.y,
    camera.position.z - selectedObject.position.z
  );
  console.log(vector.x, vector.y, vector.z);
  //向量缩放到3-6m
  vector.clampLength(3, 6);
  //修改camera和control的目标位置
  camera.lookAt(
    selectedObject.position.x,
    selectedObject.position.y,
    selectedObject.position.z
  );
  controls.target.x = selectedObject.position.x;
  controls.target.y = selectedObject.position.y;
  controls.target.z = selectedObject.position.z;
  controls.update();
  //动画
  const tween = new TWEEN.Tween(camera.position);
  tween.to(
    {
      x: selectedObject.position.x + vector.x,
      y: selectedObject.position.y + vector.y,
      z: selectedObject.position.z + vector.z,
    },
    1000
  );
  tween.start();
}
const showOther = ref(true);
const showAxesHelper = ref(true);
</script>

<style lang="scss" scoped></style>
