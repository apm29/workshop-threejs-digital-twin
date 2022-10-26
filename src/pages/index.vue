<template>
  <div h="screen" w="screen" class="atcc-workshop">
    <Renderer h="screen" w="screen">
      <Camera>
        <Scene>
          <Sky></Sky>
          <Ground></Ground>
          <CementGround></CementGround>
          <Light></Light>
          <Loading />
          <Models></Models>
        </Scene>
      </Camera>
    </Renderer>
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
import CementGround from "~/digital-twin/components/CementGround.vue";
// import PostProcess from '~/digital-twin/components/PostProcess.vue';
import GltfModel from "~/digital-twin/components/GltfModel.vue";
import Loading from "~/digital-twin/components/Loading.vue";
import Models from "~/digital-twin/combine/Models.vue";
</script>
