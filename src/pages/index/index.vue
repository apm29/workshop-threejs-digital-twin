<template>
  <NameSpace
    h="screen"
    w="screen"
    namespace="app"
    class="atcc-workshop"
    ref="digitalTwinRef"
  >
    <LoadingManagerProvider>
      <Renderer h="screen" w="screen">
        <Camera>
          <Scene>
            <PostProcess>
              <Controls></Controls>
              <Sky></Sky>
              <!-- <Ground></Ground> -->
              <!-- <CementGround></CementGround> -->
              <Light></Light>
              <Loading></Loading>
              <DataProvider>
                <CoarsePowderLineModels></CoarsePowderLineModels>
                <FinePowderLineModels></FinePowderLineModels>
              </DataProvider>
              <GltfModel
                path="./glb/海岸草地.glb"
                :position="{
                  y: -0.15,
                }"
              ></GltfModel>
            </PostProcess>
          </Scene>
        </Camera>
      </Renderer>
    </LoadingManagerProvider>
    <Frame></Frame>
    <el-tooltip content="全屏">
      <button @click="toggleFullscreen" v-if="!isFullscreen" class="fixed right-4 top-4">
        <i class="el-icon-full-screen text-lg font-bold text-blue-500" />
      </button>
    </el-tooltip>
  </NameSpace>
</template>

<script setup>
import Renderer from "~/digital-twin/components/Renderer.vue";
import Scene from "~/digital-twin/components/Scene.vue";
import Camera from "~/digital-twin/components/Camera.vue";
import Sky from "~/digital-twin/components/Sky.vue";
import Light from "~/digital-twin/components/Light.vue";
import Loading from "~/digital-twin/components/Loading.vue";
import DataProvider from "~/digital-twin/combine/DataProvider.vue";
import CoarsePowderLineModels from "~/digital-twin/combine/CoarsePowderLineModels.vue";
import FinePowderLineModels from "~/digital-twin/combine/FinePowderLineModels.vue";
import Frame from "~/digital-twin/combine/Frame.vue";
import Controls from "~/digital-twin/components/Controls.vue";
import PostProcess from "~/digital-twin/components/PostProcess.vue";
import NameSpace from "~/digital-twin/components/NameSpace.vue";
import GltfModel from "~/digital-twin/components/GltfModel.vue";
import LoadingManagerProvider from "~/digital-twin/components/LoadingManagerProvider.vue";

const digitalTwinRef = ref();
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(digitalTwinRef);
</script>
