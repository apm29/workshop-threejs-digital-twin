<template>
  <div>
    <!-- 工厂 -->
    <CustomGltfModel v-if="showOther" path="./glb/建筑.glb"></CustomGltfModel>
    <AxesHelper v-if="showAxesHelper"></AxesHelper>
    <template v-for="modelData of ViewModelData">
      <GltfModel
        :key="modelData.key + '_model'"
        :name="modelData.key"
        :path="modelData.path"
        :position="modelData.position"
        selectable
        :model.sync="modelObject3dMap[modelData.key]"
      ></GltfModel>
    </template>
    <template v-for="spriteData of ViewSpriteData">
      <SpriteLabel
        :key="spriteData.viewData.key + '_sprite'"
        :path="spriteData.path"
        :position="spriteData.position"
        :viewData="spriteData.viewData"
      ></SpriteLabel>
    </template>

    <AttachDialog v-if="selectedPosition" :attach="selectedPosition">
      <TimeSeriesChart
        :range.sync="selectedViewData.range"
        :title="selectedViewData.title"
        :org="selectedViewData.org"
        :bucket="selectedViewData.bucket"
        :measurement="selectedViewData.measurement"
        @close="resetCamera()"
      ></TimeSeriesChart>
    </AttachDialog>

    <SimpleBorder6
      fixed="!~"
      top="70px"
      min="w-12rem"
      right="0"
      z="30"
      bg="gradient-to-b"
      via="bluegray-700/10"
      from="transparent"
      to="transparent"
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
    <div
      fixed="!~"
      bottom="0"
      p="x-3 b-4 t-12"
      w="full"
      right="0"
      z="30"
      bg="gradient-to-b"
      from="transparent"
      to="dark-600"
      style="pointer-events: none"
      flex="~ wrap"
      gap="x-2 y-2"
      items="center"
    >
      <h3 w="full" text="white sm">
        <span text="red-300">红色</span>:数据异常,<span text="blue-300">蓝色</span>
        :设备关闭,<span text="green-300">绿色</span>:运行正常
      </h3>
      <el-button
        size="mini"
        @click="handleViewModel(model)"
        style="pointer-events: auto"
        :type="
          errorDeviceKeys.includes(model.viewData.key)
            ? 'danger'
            : closedDeviceKeys.includes(model.viewData.key)
            ? 'primary'
            : 'success'
        "
        m="!0"
        v-for="model of models"
        :key="model.viewData.title"
        plain
      >
        {{ model.viewData.title }}
      </el-button>
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
import GltfModel from "~/digital-twin/components/GltfModel.vue";
import CustomGltfModel from "~/digital-twin/components/CustomGltfModel.vue";
import SpriteLabel from "~/digital-twin/components/SpriteLabel.vue";
import AttachDialog from "~/digital-twin/components/AttachDialog.vue";
import AxesHelper from "~/digital-twin/components/AxesHelper.vue";
import TimeSeriesChart from "~/digital-twin/combine/TimeSeriesChart.vue";
import SimpleBorder6 from "~/svg/border/SimpleBorder6.vue";
import TWEEN from "@tweenjs/tween.js";
import { useThree } from "~/digital-twin/components/three";
import { useModels } from "~/digital-twin/components/models.js";
import { ModelData, SpriteData, DeviceStatus } from "./data.js";
import { queryInfluxDb } from "~/api/influx";
import {
  INITIAL_CAMERA_X,
  INITIAL_CAMERA_Y,
  INITIAL_CAMERA_Z,
} from "~/digital-twin/components/axes.js";

const namespace = inject(NameSpaceInjectKey);

//数据部分
const ViewModelData = ref(ModelData);
const ViewSpriteData = ref(SpriteData);
const animateDuration = 1200;
const selectedPosition = ref(null);
const selectedViewData = ref(null);
const modelObject3dMap = shallowReactive({});

const registerSelectHandler = inject(RegisterSelectHandler);
const highlighted = inject(HighlightedGroups);
const errorDevices = inject(ErrorDeviceGroups);
const closedDevices = inject(ClosedDeviceGroups);
registerSelectHandler(({ event, camera, renderer, scene, selectedObject }) => {
  handleSelect({
    event,
    camera,
    renderer,
    scene,
    selectedObject,
  });
});

function handleSelect({ event, selectedObject }) {
  if (!(selectedObject instanceof THREE.Sprite)) {
    return;
  }
  const { camera: cameraRef, control: controlRef } = useThree(namespace);
  const camera = cameraRef.value;
  const controls = controlRef.value;
  const viewData = selectedObject.userData.viewData;
  //高亮
  // console.log(modelObject3dMap[viewData.key]);
  if (modelObject3dMap[viewData.key]) {
    highlighted.value = [modelObject3dMap[viewData.key]];
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
  selectedPosition.value = selectedObject.position;
  selectedViewData.value = viewData;
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
    animateDuration
  );
  tweenControl.to(
    {
      x: selectedObject.position.x,
      y: selectedObject.position.y,
      z: selectedObject.position.z,
    },
    animateDuration
  );
  tween.start();
  tweenControl.start();
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
  const tween = new TWEEN.Tween(camera.position);
  const tweenControl = new TWEEN.Tween(controls.target);
  tween.to(
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
  tween.start();
  tweenControl.start();
}

//模型数据和位置
const { models } = useModels();

function handleViewModel({ viewData, position }) {
  console.log(position);
  const { camera: cameraRef, control: controlRef } = useThree(namespace);
  const camera = cameraRef.value;
  const controls = controlRef.value;

  //高亮
  // console.log(modelObject3dMap[viewData.key]);
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
  //视角动画
  const tween = new TWEEN.Tween(camera.position);
  const tweenControl = new TWEEN.Tween(controls.target);
  tween.to(
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
  tween.start();
  tweenControl.start();
}

const NodeStatusClassMap = {
  1: "green-node", //绿色
  2: "blue-node", //蓝色
  3: "gray-node", //灰色
  "-1": "red-node", //红色
};
const DataTextStatusClassMap = {
  1: "green-text", //绿色
  2: "blue-text", //蓝色
  3: "gray-text", //灰色
  "-1": "red-text", //红色
};
//
//1:设备开: 绿色
//2:设备关: 蓝色
//3:设备数据异常: 灰色
//
//1:工艺状态正常: 绿色
//2:工艺状态过高: 红色
//3:工艺状态过低: 红色
//4:工艺数据异常: 灰色
//
function getDeviceStateNodeClass(deviceStatus, craftStatus) {
  //工艺状态异常时显示红色
  if (craftStatus == 3 || craftStatus == 2) {
    return NodeStatusClassMap[-1];
  } else if (craftStatus == 4) {
    return NodeStatusClassMap[3];
  } else {
    return NodeStatusClassMap[deviceStatus];
  }
}
function getDeviceStateTextClass(deviceStatus, craftStatus) {
  //工艺状态异常时显示红色
  if (craftStatus == 3 || craftStatus == 2) {
    return DataTextStatusClassMap[-1];
  } else if (craftStatus == 4) {
    return DataTextStatusClassMap[3];
  } else {
    return DataTextStatusClassMap[deviceStatus];
  }
}
//设备状态
const { loading: loadingModel } = useThree(namespace);
const deviceStatus = ref([]);
const closedDeviceKeys = computed(() => {
  return deviceStatus.value.filter((d) => d.status === 2).map((it) => it.key);
});
const errorDeviceKeys = computed(() => {
  return deviceStatus.value.filter((d) => d.status === 3).map((it) => it.key);
});
watch([errorDeviceKeys, loadingModel], ([keys]) => {
  console.log("error keys", keys);
  errorDevices.value = keys
    .map((key) => {
      const model = modelObject3dMap[key];
      console.log("get", key, model);
      return model;
    })
    .filter((it) => it);
});
watch([closedDeviceKeys, loadingModel], ([keys]) => {
  console.log("closed keys", keys);
  closedDevices.value = keys
    .map((key) => {
      const model = modelObject3dMap[key];
      console.log("get", key, model);
      return model;
    })
    .filter((it) => it);
});
function getDevicesStatus() {
  return Promise.all(
    DeviceStatus.map((device) => {
      return queryInfluxDb({
        org: device.org,
        bucket: device.bucket,
        measurement: device.measurement,
        range: -1, //只查一条
      })
        .then((res) => {
          return {
            ...device,
            status: res?.data?.[0]?._value ?? 4,
          };
        })
        .catch((err) => {
          console.log(err);
          return {
            ...device,
            status: 4,
          };
        });
    })
  ).then((res) => {
    console.log(res);
    deviceStatus.value = res;
  });
}
onMounted(getDevicesStatus);
useIntervalFn(getDevicesStatus, 60_000);
</script>

<style lang="scss">
.atcc-workshop {
  .el-form-item__label {
    color: white !important;
    @apply text-shadow-lg;
  }
}
</style>
