<template>
  <div v-if="showCoarsePowderLine">
    <!-- 工厂 -->
    <GltfModel v-if="showOther" path="./glb/建筑.glb"></GltfModel>
    <GltfModel
      path="./glb/地面.glb"
      :position="{
        y: -0.15,
      }"
    ></GltfModel>
   
    <template v-for="modelData of ViewModelData">
      <GltfModel
        :key="modelData.key + '_model'"
        :name="modelData.key"
        :path="modelData.path"
        :position="modelData.position"
        :rotation="modelData.rotation"
        :model.sync="modelObject3dMap[modelData.key]"
        :animate-scale="scaleMap[modelData.key]"
      ></GltfModel>
    </template>
    <template v-if="currentMode === ModeEnum.DEVICE">
      <SpriteLabel
        v-for="spriteData of ViewSpriteData"
        :key="spriteData.viewData.key"
        :path="`./status/${
          deviceStatus.find((it) => it.key === spriteData.viewData.key)?.status ??
          DeviceStatusEnum.UNKNOWN
        }.png`"
        :position="spriteData.position"
        :rotation="spriteData.rotation"
        :viewData="spriteData.viewData"
        @click="handleSelect"
      ></SpriteLabel>
    </template>
    <template v-if="currentMode === ModeEnum.MONITOR">
      <SpriteLabel
        path="./sprite/6.png"
        :position="{
          x: 23.5,
          z: -47,
          y: 9.2,
        }"
        :viewData="{
          stream: 'http://localhost:8080/stream',
        }"
        @click="handleSelectMonitor"
      >
      </SpriteLabel>
    </template>
  </div>
</template>

<script setup>
import { ModeEnum } from "~/digital-twin/combine/mode.js";
import * as THREE from "three";
import GltfModel from "~/digital-twin/components/GltfModel.vue";
import SpriteLabel from "~/digital-twin/components/SpriteLabel.vue";


import { ModelData, SpriteData } from "./coarse-powder.js";
import { DeviceStatusEnum } from "~/definition";


const modelObject3dMap = inject("ModelObject3dMap")
const handleSelect = inject("HandleSelect")
const handleSelectMonitor = inject("HandleSelectMonitor")
const scaleMap = inject("ScaleMap")
const currentMode = inject("CurrentMode")
const deviceStatus = inject("DeviceStatus")


//数据部分
const ViewModelData = ref(ModelData);
const ViewSpriteData = ref(SpriteData);

const showCoarsePowderLine = inject("ShowCoarsePowderLine")
const showOther = inject("ShowOther")

</script>

<style lang="scss">
@font-face {
  font-family: "DS-DIGI";
  src: url("./fonts/DS-DIGI.ttf") format("truetype");
}
.atcc-workshop {
  .el-form-item__label {
    color: white !important;
    @apply text-shadow-lg;
  }
}
</style>
