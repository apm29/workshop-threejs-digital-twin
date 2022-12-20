<template>
  <div>
    <AxesHelper v-if="showAxesHelper"></AxesHelper>
    <slot></slot>
    <!-- 测试用 下-->
    <ArrowedDrawer :value="false" v-if="false">
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
    <!-- 测试工具 右-->
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
    <!-- 模式切换 左 -->
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
          <el-form-item>
            <el-radio-group
              style="pointer-events: auto"
              v-model="currentMode"
              size="mini"
            >
              <el-radio-button style="pointer-events: auto" :label="ModeEnum.DEVICE">
                设备状态
              </el-radio-button>
              <el-radio-button style="pointer-events: auto" :label="ModeEnum.MONITOR">
                视频监控
              </el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-checkbox style="pointer-events: auto" v-model="showCoarsePowderLine">
              粗粉线
            </el-checkbox>
            <el-checkbox style="pointer-events: auto" v-model="showFinePowderLine">
              细粉线
            </el-checkbox>
          </el-form-item>
        </el-form>
      </SimpleBorder6>
    </ArrowedDrawer>

    <!-- 设备详情 -->
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
    <!-- 监控详情 -->
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
  </div>
</template>

<script setup>
import * as THREE from "three";
import ArrowedDrawer from "~/components/modal/ArrowedDrawer.vue";
import GltfModel from "~/digital-twin/components/GltfModel.vue";
import AttachDialog from "~/digital-twin/components/AttachDialog.vue";
import AxesHelper from "~/digital-twin/components/AxesHelper.vue";
import { DeviceStatusEnum } from "~/definition";
import { ModeEnum } from "~/digital-twin/combine/mode.js";
import {
  HighlightedGroups,
  NameSpaceInjectKey,
} from "~/digital-twin/components/inject-keys.js";
import {
  INITIAL_CAMERA_X,
  INITIAL_CAMERA_Y,
  INITIAL_CAMERA_Z,
} from "~/digital-twin/components/axes.js";
import { useDeviceStatusStore, useKinStatusStore } from "~/store";
import TWEEN from "@tweenjs/tween.js";
import { useThree } from "~/digital-twin/components/three";
import { useModels } from "~/digital-twin/components/models.js";
import TimeSeriesChart from "~/digital-twin/combine/TimeSeriesChart.vue";
import MaterialDelivery from "~/digital-twin/combine/MaterialDelivery.vue";
import SimpleBorder6 from "~/svg/border/SimpleBorder6.vue";
const namespace = inject(NameSpaceInjectKey);

//总览数据
const animateDuration = 2000;
const selectedPosition = ref();
const selectedViewData = ref({});
const modelObject3dMap = shallowReactive({});
provide("ModelObject3dMap", modelObject3dMap);

const highlighted = inject(HighlightedGroups);
//选择设备
function handleSelect({ event, selectedObject }) {
  handleViewModel({
    viewData: selectedObject.userData.viewData,
    position: selectedObject.position,
  });
}
provide("HandleSelect", handleSelect);

//选择监控
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
provide("HandleSelectMonitor", handleSelectMonitor);

function unselectMonitor() {
  showMonitor.value = false;
  monitorPosition.value = null;
  monitorStream.value = null;
  resetCamera();
}
provide("UnselectMonitor", unselectMonitor);
//切换模式
const currentMode = ref(ModeEnum.DEVICE);
provide("CurrentMode", currentMode);

//线切换
const showCoarsePowderLine = ref(true);
const showFinePowderLine = ref(true);
provide("ShowCoarsePowderLine", showCoarsePowderLine);
provide("ShowFinePowderLine", showFinePowderLine);

const showMonitor = ref(false);
const showOther = ref(true);
provide("ShowOther", showOther);
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
provide("DeviceStatus", deviceStatus);

//窑速计算
const kinStatusStore = useKinStatusStore();
const { animationScale } = toRefs(kinStatusStore);
const scaleMap = reactive({
  T2: 1,
  DY_BODY2: 1,
  DY_BODY3: 1,
});
provide("ScaleMap", scaleMap);
watch(animationScale, (scale) => {
  scaleMap.T2 = scale;
  scaleMap.DY_BODY2 = scale;
  scaleMap.DY_BODY3 = scale;
});

function changeAnimationScaleWithKey(key) {
  scaleMap[key] =
    deviceStatus.value.find((it) => it.key === key)?.status === DeviceStatusEnum.NORMAL
      ? 1
      : 0;
}

watch(deviceStatus, () => {
  changeAnimationScaleWithKey("C_ZMJ");
  changeAnimationScaleWithKey("C_CMJ");
  changeAnimationScaleWithKey("C_PDJ");
  changeAnimationScaleWithKey("QMJ9_A");
  changeAnimationScaleWithKey("QMJ10_A");
  changeAnimationScaleWithKey("QMJ11_A");
  changeAnimationScaleWithKey("QMJ12_A");
  changeAnimationScaleWithKey("QMJ13_A");
  changeAnimationScaleWithKey("QMJ14_A");
  changeAnimationScaleWithKey("QMJ15_A");
  changeAnimationScaleWithKey("QMJ16_A");
  changeAnimationScaleWithKey("QMJ17_A");
  changeAnimationScaleWithKey("QMJ18_A");
});
</script>

<style lang="scss" scoped></style>
