<template>
  <NameSpace h="screen" w="screen" namespace="app" class="atcc-workshop">
    <Renderer h="screen" w="screen">
      <Camera>
        <Scene stats>
          <PostProcess>
            <Controls></Controls>
            <Sky></Sky>
            <Ground></Ground>
            <CementGround></CementGround>
            <Light></Light>
            <Loading></Loading>
            <Models></Models>
          </PostProcess>
        </Scene>
      </Camera>
    </Renderer>
    <Frame></Frame>
  </NameSpace>
</template>

<script setup>
import Renderer from "~/digital-twin/components/Renderer.vue";
import Scene from "~/digital-twin/components/Scene.vue";
import Camera from "~/digital-twin/components/Camera.vue";
import Sky from "~/digital-twin/components/Sky.vue";
import Light from "~/digital-twin/components/Light.vue";
import Ground from "~/digital-twin/components/Ground.vue";
import CementGround from "~/digital-twin/components/CementGround.vue";
import Loading from "~/digital-twin/components/Loading.vue";
import Models from "~/digital-twin/combine/Models.vue";
import Frame from "~/digital-twin/combine/Frame.vue";
import Controls from "~/digital-twin/components/Controls.vue";
import PostProcess from "~/digital-twin/components/PostProcess.vue";
import NameSpace from "~/digital-twin/components/NameSpace.vue";
</script>
