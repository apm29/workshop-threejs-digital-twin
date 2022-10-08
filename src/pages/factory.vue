<template>
  <Renderer>
    <Camera>
      <Scene>
        <AxesHelper></AxesHelper>
        <Sky></Sky>
        <Ground></Ground>
        <Light></Light>
        <!-- 工厂 -->
        <GltfModel path="/model/生产组件3着色.glb"></GltfModel>

        <!-- 后处理 -->
        <!-- <PostProcess></PostProcess> -->
      </Scene>
    </Camera>
  </Renderer>
</template>

<script setup>
import Renderer from '~/digital-twin/components/Renderer.vue';
import Scene from '~/digital-twin/components/Scene.vue';
import Camera from '~/digital-twin/components/Camera.vue';
import AxesHelper from '~/digital-twin/components/AxesHelper.vue';
import Sky from '~/digital-twin/components/Sky.vue';
import Light from '~/digital-twin/components/Light.vue';
import Ground from '~/digital-twin/components/Ground.vue';
// import PostProcess from '~/digital-twin/components/PostProcess.vue';
import GltfModel from '~/digital-twin/components/GltfModel.vue';
</script>

<style lang="scss" scoped>

</style>
