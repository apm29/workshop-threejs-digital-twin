<template>
  <NameSpace
    h="screen"
    w="screen"
    namespace="app"
    class="atcc-workshop"
    ref="digitalTwinRef"
  >
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
            <Models></Models>
          </PostProcess>
        </Scene>
      </Camera>
    </Renderer>
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
import Models from "~/digital-twin/combine/Models.vue";
import Frame from "~/digital-twin/combine/Frame.vue";
import Controls from "~/digital-twin/components/Controls.vue";
import PostProcess from "~/digital-twin/components/PostProcess.vue";
import NameSpace from "~/digital-twin/components/NameSpace.vue";

const digitalTwinRef = ref();
const { isFullscreen, toggle: toggleFullscreen } = useFullscreen(digitalTwinRef);
</script>
