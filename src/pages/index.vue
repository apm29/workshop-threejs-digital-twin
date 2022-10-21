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
              y: 5.5,
              z: -44.5,
            }"
            :viewData="{
              title: '工艺配料-P1',
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/P1.glb"
            :position="{
              x: 6.9,
              z: -43.36,
            }"
            selectable
          ></GltfModel>
          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 8,
              y: 5.5,
              z: -46.5,
            }"
            :viewData="{
              title: '工艺配料-P2',
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/P2.glb"
            :position="{
              x: 6.9,
              z: -45.2,
            }"
            selectable
          ></GltfModel>
          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 8,
              y: 5.5,
              z: -48.9,
            }"
            :viewData="{
              title: '工艺配料-P3',
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/P3.glb"
            :position="{
              x: 6.9,
              z: -47.35,
            }"
            selectable
          ></GltfModel>
          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 8.5,
              y: 5.5,
              z: -50.9,
            }"
            :viewData="{
              title: '工艺配料-P4',
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/P4.glb"
            :position="{
              x: 7.4,
              z: -49.35,
            }"
            selectable
          ></GltfModel>
          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 11.5,
              y: 10,
              z: -46.95,
            }"
            :viewData="{
              title: '工艺配料-P5',
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/P5.glb"
            :position="{
              x: 9.6,
              z: -42.95,
              y: 6.7,
            }"
            selectable
          ></GltfModel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 11.3,
              y: 6.2,
              z: -45,
            }"
            :viewData="{
              title: '原料混合-犁刀机电流',
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/犁刀机.glb"
            :position="{
              x: 10.5,
              z: -45,
              y: 2.4,
            }"
            selectable
          ></GltfModel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 15.5,
              y: 3.5,
              z: -47,
            }"
            :viewData="{
              title: '原料混合-致密机电流',
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/致密机.glb"
            :position="{
              x: 13.2,
              z: -46.2,
              y: 0,
            }"
            selectable
          ></GltfModel>
          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 19.5,
              z: -50.5,
              y: 7,
            }"
            :viewData="{
              title: '原料混合-致密机除尘器电流',
            }"
          ></SpriteLabel>
          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 23.5,
              z: -50.2,
              y: 12.5,
            }"
            :viewData="{
              title: '原料混合-给料电振机电流',
            }"
          ></SpriteLabel>
          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 24.5,
              z: -50.2,
              y: 10.5,
            }"
            :viewData="{
              title: '原料混合-双轴搅拌机电流',
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/致密机后输送.glb"
            :position="{
              x: 21,
              z: -49.6,
              y: 1.2,
            }"
            selectable
          ></GltfModel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 23.5,
              z: -50.2,
              y: 7.8,
            }"
            :viewData="{
              title: '造球区-造球机电流',
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/造球盘.glb"
            :position="{
              x: 23.5,
              z: -49,
              y: 6.5,
            }"
            selectable
          ></GltfModel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 23.5,
              z: -47,
              y: 9.2,
            }"
            :viewData="{
              title: '造球区-皮带机电流',
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/皮带机.glb"
            :position="{
              x: 23,
              z: -43,
              y: 6,
            }"
            selectable
          ></GltfModel>
          <!-- 后处理 -->
          <!-- <PostProcess></PostProcess> -->

          <AttachDialog
            v-if="selectedPosition"
            :attach="selectedPosition"
            :viewData="selectedViewData"
            @close="selectedPosition = null"
          >
          </AttachDialog>
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
import AttachDialog from "~/digital-twin/components/AttachDialog.vue";
import TWEEN from "@tweenjs/tween.js";

const selectedPosition = ref(null);
const selectedViewData = ref(null);
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
  // camera.lookAt(
  //   selectedObject.position.x,
  //   selectedObject.position.y,
  //   selectedObject.position.z
  // );
  console.log("viewData", selectedObject.userData.viewData);
  selectedPosition.value = selectedObject.position;
  selectedViewData.value = selectedObject.userData.viewData;
  // controls.target.x = selectedObject.position.x;
  // controls.target.y = selectedObject.position.y;
  // controls.target.z = selectedObject.position.z;
  // controls.update();
  //动画
  const tween = new TWEEN.Tween(camera.position);
  const tweenControl = new TWEEN.Tween(controls.target);
  tween.to(
    {
      x: selectedObject.position.x + vector.x,
      y: selectedObject.position.y + vector.y,
      z: selectedObject.position.z + vector.z,
    },
    1000
  );
  tweenControl.to(
    {
      x: selectedObject.position.x,
      y: selectedObject.position.y,
      z: selectedObject.position.z,
    },
    1000
  );
  tween.start();
  tweenControl.start();
}
const showOther = ref(true);
const showAxesHelper = ref(true);
</script>

<style lang="scss">
.el-form-item__label {
  color: white;
  @apply text-shadow-lg;
}
</style>
