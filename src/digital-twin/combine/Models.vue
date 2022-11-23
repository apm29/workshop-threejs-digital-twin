<template>
  <div>
    <!-- 工厂 -->
    <GltfModel v-if="showOther" path="./glb/建筑.glb"></GltfModel>
    <GltfModel
      path="./glb/海岸草地.glb"
      :position="{
        y: -0.15,
      }"
    ></GltfModel>
    <GltfModel
      path="./glb/地面.glb"
      :position="{
        y: -0.15,
      }"
    ></GltfModel>
    <AxesHelper v-if="showAxesHelper"></AxesHelper>
    <template v-for="modelData of ViewModelData">
      <GltfModel
        :key="modelData.key + '_model'"
        :name="modelData.key"
        :path="modelData.path"
        :position="modelData.position"
        :model.sync="modelObject3dMap[modelData.key]"
        :animate-scale="scaleMap[modelData.key]"
      ></GltfModel>
    </template>
    <template v-if="currentMode === ModeEnum.DEVICE">
      <SpriteLabel
        v-for="spriteData of ViewSpriteData"
        :path="`./status/${
          deviceStatus.find((it) => it.key === spriteData.viewData.key)?.status ??
          DeviceStatusEnum.UNKNOWN
        }.png`"
        :position="spriteData.position"
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
          stream: 'http://192.168.88.6:8080/stream',
        }"
        @click="handleSelectMonitor"
      >
      </SpriteLabel>
    </template>
    <!-- <GltfModel
      path="./glb/银色点状纹金属.glb"
      :position="{
        x: 15,
        y: 0,
        z: -33,
      }"
    ></GltfModel> -->

    <AttachDialog v-if="selectedPosition" :attach="selectedPosition">
      <MaterialDelivery
        v-if="['P1', 'P2', 'P3', 'P4', 'P5'].includes(selectedViewData.key)"
        :range.sync="selectedViewData.range"
        :title="selectedViewData.title"
        :craft-key="selectedViewData.key"
        :org="selectedViewData.org"
        :bucket="selectedViewData.bucket"
        :measurement="selectedViewData.measurement"
        :status="selectedViewData.status"
        :model="selectedViewData.model"
        @close="resetCamera()"
      ></MaterialDelivery>
      <TimeSeriesChart
        v-else
        :range.sync="selectedViewData.range"
        :title="selectedViewData.title"
        :org="selectedViewData.org"
        :bucket="selectedViewData.bucket"
        :measurement="selectedViewData.measurement"
        :status="selectedViewData.status"
        :model="selectedViewData.model"
        @close="resetCamera()"
      ></TimeSeriesChart>
    </AttachDialog>
    <AttachDialog v-if="showMonitor" :attach="monitorPosition">
      <SimpleBorder6
        min="w-6rem"
        z="30"
        bg="gradient-to-b"
        via="bluegray-700/70"
        from="blue-500/70"
        to="blue-500/70"
      >
        <div
          class="time-series-dialog"
          text="sm gray-200"
          flex="~ col"
          p="x-6 y-4"
          w="160"
          min="h-100"
        >
          <h1 text="lg" font="bold" relative="~">
            视频监控
            <button @click="unselectMonitor" text="2xl" absolute="~" right="2" top="1">
              <i i-mdi-close></i>
            </button>
          </h1>
          <div flex="~ grow" overflow="y-auto">
            <video w="full" h="full" autoplay="autoplay" preload="load">
              <source :src="monitorStream" type="video/ogg" />
            </video>
          </div>
        </div>
      </SimpleBorder6>
    </AttachDialog>
    <ArrowedDrawer top="[calc(50vh-100px)]" :value="true" direction="left">
      <SimpleBorder6
        min="w-6rem"
        z="30"
        bg="gradient-to-b"
        via="bluegray-700/10"
        from="blue-500/10"
        to="blue-500/10"
      >
        <el-form
          label-position="left"
          label-width="0rem"
          style="pointer-events: none"
          size="mini"
          p="x-4 y-4"
        >
          <el-form-item label="" style="pointer-events: auto">
            <el-button @click="currentMode = ModeEnum.DEVICE">设备状态</el-button>
          </el-form-item>
          <el-form-item label="" style="pointer-events: auto">
            <el-button @click="currentMode = ModeEnum.MONITOR">视频监控</el-button>
          </el-form-item>
        </el-form>
      </SimpleBorder6>
    </ArrowedDrawer>
    <ArrowedDrawer top="[calc(50vh-150px)]" :value="true" direction="right">
      <SimpleBorder6
        min="w-12rem"
        z="30"
        bg="gradient-to-b"
        via="bluegray-700/10"
        from="blue-500/10"
        to="blue-500/10"
        class="test-drawer"
      >
        <el-form
          label-position="left"
          label-width="6rem"
          style="pointer-events: none"
          size="mini"
          p="x-4 y-4"
        >
          <el-form-item label="显示坐标轴" style="pointer-events: auto">
            <el-switch v-model="showAxesHelper"></el-switch>
          </el-form-item>
          <el-form-item label="显示建筑" style="pointer-events: auto">
            <el-switch v-model="showOther"></el-switch>
          </el-form-item>
          <el-form-item label="自动旋转" style="pointer-events: auto">
            <el-switch v-model="autoRotate"></el-switch>
          </el-form-item>
          <el-form-item label="" style="pointer-events: auto">
            <el-button @click="resetCamera">重置视角</el-button>
          </el-form-item>
        </el-form>
      </SimpleBorder6>
    </ArrowedDrawer>
    <ArrowedDrawer :value="false" v-if="currentMode === ModeEnum.DEVICE">
      <SimpleBorder6
        bg="gradient-to-b"
        via="bluegray-700/10"
        from="blue-500/10"
        to="blue-500/10"
      >
        <div
          w="full"
          p="x-3 b-4 t-6"
          style="pointer-events: none"
          flex="~ wrap"
          gap="x-2 y-2"
          items="center"
        >
          <h3 w="full" text="white sm">
            <span text="gray-300">灰色</span> :数据异常,
            <span text="red-300">红色</span> :工艺状态异常,
            <span text="blue-300"> 蓝色 </span> :设备关闭,
            <span text="green-300"> 绿色 </span>
            :运行正常,
            <span text="orange-300"> 黄色 </span>
            :未获取到数据
          </h3>
          <el-button
            size="mini"
            @click="handleViewModel(model)"
            style="pointer-events: auto"
            :type="
              errorDeviceKeys.includes(model.viewData.key)
                ? 'info'
                : craftErrorDeviceKeys.includes(model.viewData.key)
                ? 'danger'
                : closedDeviceKeys.includes(model.viewData.key)
                ? 'primary'
                : normalDeviceKeys.includes(model.viewData.key)
                ? 'success'
                : 'warning'
            "
            m="!0"
            v-for="model of models"
            :key="model.viewData.title"
            plain
          >
            {{ model.viewData.title }}
          </el-button>
        </div>
      </SimpleBorder6>
    </ArrowedDrawer>
    <div fixed="~" top="20" left="2" flex="~" gap="3">
      <SimpleBorder6
        z="30"
        bg="gradient-to-b"
        via="dark-700/70"
        from="dark-500/70"
        to="dark-500/70"
      >
        <div p="x-3 y-2">
          <SimpleNumber
            text="4xl white"
            prefix="天然气用量"
            suffix="m³"
            :value="naturalGasTotal"
          ></SimpleNumber>
        </div>
      </SimpleBorder6>
      <SimpleBorder6
        z="30"
        bg="gradient-to-b"
        via="dark-700/70"
        from="dark-500/70"
        to="dark-500/70"
      >
        <div p="x-3 y-2">
          <SimpleNumber
            text="4xl white"
            prefix="电力消耗"
            :value="electricityGasTotal"
            suffix="kWh"
          ></SimpleNumber>
        </div>
      </SimpleBorder6>
      <SimpleBorder6
        z="30"
        bg="gradient-to-b"
        via="dark-700/70"
        from="dark-500/70"
        to="dark-500/70"
      >
        <div p="x-3 y-2">
          <SimpleNumber
            text="4xl white"
            prefix="当前生产型号"
            :value="sensitive(currentProducingFormula?.productNo) ?? '- -'"
          ></SimpleNumber>
        </div>
      </SimpleBorder6>
      <SimpleBorder6
        z="30"
        bg="gradient-to-b"
        via="dark-700/70"
        from="dark-500/70"
        to="dark-500/70"
      >
        <div flex="~" p="x-3 y-2">
          <h1 text="blue-400 xl" m="r-2">进料</h1>
          <div flex="~" gap="6">
            <div>
              <h1 text="white xl">P1</h1>
              <SimpleNumber
                text="4xl white"
                suffix="kg"
                :value="deliveryAmount.P1"
              ></SimpleNumber>
            </div>
            <div>
              <h1 text="white xl">P2</h1>
              <SimpleNumber
                text="4xl white"
                suffix="kg"
                :value="deliveryAmount.P2"
              ></SimpleNumber>
            </div>
            <div>
              <h1 text="white xl">P3</h1>
              <SimpleNumber
                text="4xl white"
                suffix="kg"
                :value="deliveryAmount.P3"
              ></SimpleNumber>
            </div>
            <div>
              <h1 text="white xl">P4</h1>
              <SimpleNumber
                text="4xl white"
                suffix="kg"
                :value="deliveryAmount.P4"
              ></SimpleNumber>
            </div>
            <div>
              <h1 text="white xl">P5</h1>
              <SimpleNumber
                text="4xl white"
                suffix="kg"
                :value="deliveryAmount.P5"
              ></SimpleNumber>
            </div>
            <div>
              <h1 text="white lg">配料桶数</h1>
              <SimpleNumber
                text="4xl white"
                suffix="桶"
                :value="materialDeliveryData.NP"
              ></SimpleNumber>
            </div>
          </div>
        </div>
      </SimpleBorder6>

      <SimpleBorder6
        z="30"
        bg="gradient-to-b"
        via="dark-700/70"
        from="dark-500/70"
        to="dark-500/70"
      >
        <div flex="~" p="x-3 y-2" gap="3">
          <h1 text="blue-400 xl" m="r-2">出料</h1>
          <div flex="~" gap="6">
            <div>
              <h1 text="white lg">日出料</h1>
              <SimpleNumber
                text="4xl white"
                suffix="kg"
                :value="coarsePowderOutput.day"
              ></SimpleNumber>
            </div>
          </div>
          <div flex="~" gap="6">
            <div>
              <h1 text="white lg">月出料</h1>
              <SimpleNumber
                text="4xl white"
                suffix="kg"
                :value="coarsePowderOutput.month"
              ></SimpleNumber>
            </div>
          </div>
        </div>
      </SimpleBorder6>
    </div>
    <div fixed="~" bottom="2" left="2" right="2" flex="~" gap="3">
      <SimpleBorder6
        z="30"
        w="full"
        bg="gradient-to-b"
        via="dark-300/70"
        from="dark-500/70"
        to="dark-500/70"
      >
        <iframe
          id="iframe"
          src="http://atcc-workshop.ciih.net/charts/#/factory-3/material/daily"
          frameborder="0"
          width="100%"
          height="100%"
        />
      </SimpleBorder6>
    </div>
  </div>
</template>

<script setup>
import {
  HighlightedGroups,
  RegisterSelectHandler,
  ErrorDeviceGroups,
  ClosedDeviceGroups,
  NameSpaceInjectKey,
} from "~/digital-twin/components/inject-keys.js";
import * as THREE from "three";
import ArrowedDrawer from "~/components/modal/ArrowedDrawer.vue";
import GltfModel from "~/digital-twin/components/GltfModel.vue";
import CustomGltfModel from "~/digital-twin/components/CustomGltfModel.vue";
import SpriteLabel from "~/digital-twin/components/SpriteLabel.vue";
import AttachDialog from "~/digital-twin/components/AttachDialog.vue";
import AxesHelper from "~/digital-twin/components/AxesHelper.vue";
import TimeSeriesChart from "~/digital-twin/combine/TimeSeriesChart.vue";
import MaterialDelivery from "~/digital-twin/combine/MaterialDelivery.vue";
import SimpleBorder6 from "~/svg/border/SimpleBorder6.vue";
import SimpleNumber from "~/svg/SimpleNumber.vue";
import TWEEN from "@tweenjs/tween.js";
import { useThree } from "~/digital-twin/components/three";
import { useModels } from "~/digital-twin/components/models.js";
import { ModelData, SpriteData } from "./data.js";
import { DeviceStatusEnum } from "~/definition";
import { sensitive } from "~/composables";
import {
  INITIAL_CAMERA_X,
  INITIAL_CAMERA_Y,
  INITIAL_CAMERA_Z,
} from "~/digital-twin/components/axes.js";
import {
  useDeviceStatusStore,
  useKinStatusStore,
  useEnergyStore,
  useMaterialDeliveryStore,
} from "~/store";

const namespace = inject(NameSpaceInjectKey);

//切换模式
const ModeEnum = {
  DEVICE: 1,
  MONITOR: 2,
};
const currentMode = ref(ModeEnum.DEVICE);

//数据部分
const ViewModelData = ref(ModelData);
const ViewSpriteData = ref(SpriteData);
const animateDuration = 2000;
const selectedPosition = ref();
const selectedViewData = ref({});
const modelObject3dMap = shallowReactive({});

const registerSelectHandler = inject(RegisterSelectHandler);
const highlighted = inject(HighlightedGroups);
const errorDevices = inject(ErrorDeviceGroups);
const closedDevices = inject(ClosedDeviceGroups);

function handleSelect({ event, selectedObject }) {
  handleViewModel({
    viewData: selectedObject.userData.viewData,
    position: selectedObject.position,
  });
}

const showMonitor = ref(false);
const monitorStream = ref(null);
const monitorPosition = ref(null);
function handleSelectMonitor({ event, selectedObject }) {
  monitorPosition.value = selectedObject.position;
  monitorStream.value = selectedObject.userData.viewData.stream;
  showMonitor.value = true;
  const { camera: cameraRef, control: controlRef } = useThree(namespace);
  const camera = cameraRef.value;
  const controls = controlRef.value;

  const position = selectedObject.position;
  //向量计算
  //物体位置--> 相机位置向量
  const vector = new THREE.Vector3(
    camera.position.x - position.x,
    camera.position.y - position.y,
    camera.position.z - position.z
  );
  //向量缩放到3-6m
  vector.clampLength(3, 6);
  //视角动画
  const tweenCamera = new TWEEN.Tween(camera.position);
  const tweenControl = new TWEEN.Tween(controls.target);
  tweenCamera.to(
    {
      x: position.x + vector.x,
      y: position.y + vector.y,
      z: position.z + vector.z,
    },
    animateDuration
  );
  tweenControl.to(
    {
      x: position.x,
      y: position.y,
      z: position.z,
    },
    animateDuration
  );
  tweenCamera.start();
  tweenControl.start();
}
function unselectMonitor() {
  showMonitor.value = false;
  monitorPosition.value = null;
  monitorStream.value = null;
  resetCamera();
}

const showOther = ref(true);

const showAxesHelper = ref(false);

//自动旋转开关
const { control } = useThree(namespace);
const autoRotate = ref(control.autoRotate);
watch(autoRotate, (autoRotate) => {
  control.value.autoRotate = autoRotate;
  // control.value.update();
});

function resetCamera() {
  //清空数据
  selectedPosition.value = null;
  selectedViewData.value = null;
  highlighted.value = [];
  const { camera: cameraRef, control: controlRef } = useThree(namespace);
  const camera = cameraRef.value;
  const controls = controlRef.value;
  //视角动画
  const tweenCamera = new TWEEN.Tween(camera.position);
  const tweenControl = new TWEEN.Tween(controls.target);
  tweenCamera.to(
    {
      x: INITIAL_CAMERA_X,
      y: INITIAL_CAMERA_Y,
      z: INITIAL_CAMERA_Z,
    },
    animateDuration
  );
  tweenControl.to(
    {
      x: 0,
      y: 0,
      z: 0,
    },
    animateDuration
  );
  tweenCamera.start();
  tweenControl.start();
}

//模型数据和位置
const { models } = useModels();

function handleViewModel({ viewData, position }) {
  const { camera: cameraRef, control: controlRef } = useThree(namespace);
  const camera = cameraRef.value;
  const controls = controlRef.value;

  //高亮
  if (modelObject3dMap[viewData.key]) {
    highlighted.value = [modelObject3dMap[viewData.key]];
  }

  //向量计算
  //物体位置--> 相机位置向量
  const vector = new THREE.Vector3(
    camera.position.x - position.x,
    camera.position.y - position.y,
    camera.position.z - position.z
  );
  //向量缩放到3-6m
  vector.clampLength(3, 6);
  selectedPosition.value = position;
  selectedViewData.value = viewData;
  console.log(selectedViewData.value);
  //视角动画
  const tweenCamera = new TWEEN.Tween(camera.position);
  const tweenControl = new TWEEN.Tween(controls.target);
  tweenCamera.to(
    {
      x: position.x + vector.x,
      y: position.y + vector.y,
      z: position.z + vector.z,
    },
    animateDuration
  );
  tweenControl.to(
    {
      x: position.x,
      y: position.y,
      z: position.z,
    },
    animateDuration
  );
  tweenCamera.start();
  tweenControl.start();
}

//设备状态
const { loading: loadingModel } = useThree(namespace);
const deviceStore = useDeviceStatusStore();
const {
  deviceStatus,
  closedDeviceKeys,
  errorDeviceKeys,
  normalDeviceKeys,
  craftErrorDeviceKeys,
} = toRefs(deviceStore);

// watch([errorDeviceKeys, loadingModel], ([keys, loading]) => {
//   if (!loading) {
//     errorDevices.value = keys
//       .map((key) => {
//         const model = modelObject3dMap[key];
//         console.log("get", key, model);
//         return model;
//       })
//       .filter((it) => it);
//   }
// });
// watch([closedDeviceKeys, loadingModel], ([keys, loading]) => {
//   if (!loading) {
//     closedDevices.value = keys
//       .map((key) => {
//         const model = modelObject3dMap[key];
//         console.log("get", key, model);
//         return model;
//       })
//       .filter((it) => it);
//   }
// });

//窑速计算
const kinStatusStore = useKinStatusStore();
const { animationScale } = toRefs(kinStatusStore);
const scaleMap = reactive({
  T2: 1,
  DY_BODY2: 1,
  DY_BODY3: 1,
});
watch(animationScale, (scale) => {
  scaleMap.T2 = scale;
  scaleMap.DY_BODY2 = scale;
  scaleMap.DY_BODY3 = scale;
});
watch(deviceStatus, (deviceStatus) => {
  scaleMap.C_ZMJ =
    deviceStatus.find((it) => it.key === "C_ZMJ")?.status === DeviceStatusEnum.NORMAL
      ? 1
      : 0;
  scaleMap.C_CMJ =
    deviceStatus.find((it) => it.key === "C_CMJ")?.status === DeviceStatusEnum.NORMAL
      ? 1
      : 0;
});

//能耗
const energyStore = useEnergyStore();
const { naturalGasTotal, electricityGasTotal } = toRefs(energyStore); //能耗

//投料数据
const materialDeliveryStore = useMaterialDeliveryStore();
const {
  materialDeliveryData,
  deliveryAmount,
  coarsePowderOutput,
  currentProducingFormula,
} = toRefs(materialDeliveryStore);
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
