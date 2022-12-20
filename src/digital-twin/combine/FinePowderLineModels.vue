<template>
  <div v-if="showFinePowderLine">
    <GltfModel
      path="./glb/地面2.glb"
      :position="{
        y: -0.15,
        x: -11,
        z: -28.5,
      }"
    ></GltfModel>
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
  </div>
</template>

<script setup>
import { ModeEnum } from "~/digital-twin/combine/mode.js";
import * as THREE from "three";

import GltfModel from "~/digital-twin/components/GltfModel.vue";
import SpriteLabel from "~/digital-twin/components/SpriteLabel.vue";
import { DeviceStatusEnum } from "~/definition";
import { ModelData, SpriteData } from "./fine-powder.js";

const modelObject3dMap = inject("ModelObject3dMap")
const handleSelect = inject("HandleSelect")
const handleSelectMonitor = inject("HandleSelectMonitor")
const scaleMap = inject("ScaleMap")
const currentMode = inject("CurrentMode")
const deviceStatus = inject("DeviceStatus")


//数据部分
const ViewModelData = ref(ModelData);
const ViewSpriteData = ref(SpriteData);

//显示
const showFinePowderLine = inject("ShowFinePowderLine")
</script>

<style lang="scss" scoped></style>
