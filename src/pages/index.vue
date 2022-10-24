<template>
  <div h="screen" w="screen" class="atcc-workshop">
    <Renderer h="screen" w="screen">
      <Camera>
        <Scene @object:selected="handleSelect">
          <AxesHelper v-if="showAxesHelper"></AxesHelper>
          <Sky></Sky>
          <Ground></Ground>
          <Light></Light>
          <Loading />
          <!-- 工厂 -->
          <GltfModel v-if="showOther" path="./glb/其他.glb"></GltfModel>
          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 8,
              y: 5.5,
              z: -44.2,
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
              z: -46.2,
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
              z: -48.2,
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
              z: -50.2,
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
              x: 23.4,
              z: -50.2,
              y: 10.5,
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
              z: -43.2,
              y: 6,
            }"
            selectable
          ></GltfModel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 24.5,
              z: -50.2,
              y: 3.5,
            }"
            :viewData="{
              title: '回转窑-引风机电流',
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/引风机.glb"
            :position="{
              x: 23.8,
              z: -42.7,
              y: 0,
            }"
            selectable
          ></GltfModel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 31.3,
              z: -50.8,
              y: 18.5,
            }"
            :viewData="{
              title: '冷却-喷淋塔',
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/喷淋塔.glb"
            :position="{
              x: 29.2,
              z: -48.7,
              y: 0,
            }"
            selectable
          ></GltfModel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 23.2,
              z: -43,
              y: 12.5,
            }"
            :viewData="{
              title: '回转窑-关风机电流',
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/关风机.glb"
            :position="{
              x: 22.9,
              z: -42.3,
              y: 8.5,
            }"
            selectable
          ></GltfModel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 23.2,
              z: -6.5,
              y: 9.5,
            }"
            :viewData="{
              title: '回转窑-红外',
            }"
          ></SpriteLabel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 23.2,
              z: -10.5,
              y: 9.5,
            }"
            :viewData="{
              title: '回转窑-T2',
            }"
          ></SpriteLabel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 29.2,
              z: -7,
              y: 9,
            }"
            :viewData="{
              title: '回转窑-天然气',
            }"
          ></SpriteLabel>

          <GltfModel
            path="./glb/大窑.glb"
            :position="{
              x: 22,
              z: -4.5,
              y: 5.35,
            }"
            selectable
          ></GltfModel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 25,
              z: -41.5,
              y: 12.5,
            }"
            :viewData="{
              title: '回转窑-T12',
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/引风大窑连接管.glb"
            :position="{
              x: 23.1,
              z: -41.2,
              y: 8.2,
            }"
            selectable
          ></GltfModel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 23.5,
              z: -1.8,
              y: 2.5,
            }"
            :viewData="{
              title: '回转窑-鼓风机',
            }"
          ></SpriteLabel>

          <GltfModel
            path="./glb/鼓风机.glb"
            :position="{
              x: 23.2,
              z: -1,
              y: 0,
            }"
            selectable
          ></GltfModel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 27,
              z: -13.5,
              y: 5.5,
            }"
            :viewData="{
              title: '冷却-冷却桶',
            }"
          ></SpriteLabel>

          <GltfModel
            path="./glb/冷却桶.glb"
            :position="{
              x: 23.2,
              z: -6.5,
              y: 1.5,
            }"
            selectable
          ></GltfModel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 24.3,
              z: -22.5,
              y: 4.5,
            }"
            :viewData="{
              title: '外加籽料',
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/外加籽料.glb"
            :position="{
              x: 23.65,
              z: -21.4,
              y: 1.7,
            }"
            selectable
          ></GltfModel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 24.3,
              z: -26.5,
              y: 4.5,
            }"
            :viewData="{
              title: '干磨机',
            }"
          ></SpriteLabel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 24.3,
              z: -31.5,
              y: 3.5,
            }"
            :viewData="{
              title: '振动筛',
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/干磨机.glb"
            :position="{
              x: 23.5,
              z: -24.5,
              y: 0,
            }"
            selectable
          ></GltfModel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 19,
              z: -32.8,
              y: 3.8,
            }"
            :viewData="{
              title: '称量包装机',
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/称量包装机.glb"
            :position="{
              x: 18.1,
              z: -32,
              y: 1.5,
            }"
            selectable
          ></GltfModel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 20,
              z: -31.7,
              y: 2,
            }"
            :viewData="{
              title: '输送',
            }"
          ></SpriteLabel>
          <GltfModel
            path="./glb/干磨机后输送.glb"
            :position="{
              x: 20,
              z: -31.3,
              y: 0.5,
            }"
            selectable
          ></GltfModel>

          <SpriteLabel
            path="./sprite/3.png"
            :position="{
              x: 18,
              z: -31.7,
              y: 10,
            }"
            :viewData="{
              title: '除尘机',
            }"
          ></SpriteLabel>

          <GltfModel
            path="./glb/干磨机的除尘机.glb"
            :position="{
              x: 17.3,
              z: -31.2,
              y: 6.3,
            }"
            selectable
          ></GltfModel>

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
      style="pointer-events: none"
    >
      <el-form-item label="显示坐标轴" style="pointer-events: auto">
        <el-switch v-model="showAxesHelper"></el-switch>
      </el-form-item>
      <el-form-item label="显示建筑" style="pointer-events: auto">
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
import Loading from "~/digital-twin/components/Loading.vue";
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
.atcc-workshop {
  .el-form-item__label {
    color: white !important;
    @apply text-shadow-lg;
  }
}
</style>
