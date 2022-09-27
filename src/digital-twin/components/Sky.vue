<template>
  <div>
    <slot></slot>
  </div>
</template>

<script setup>
import * as THREE from "three";
import { SceneInjectKey } from "./inject-keys"

const scene = inject(SceneInjectKey)

const uniforms = {
  topColor: { value: new THREE.Color(0x0077ff) },
  bottomColor: { value: new THREE.Color(0xffffff) }, offset: { value: 33 },
  exponent: { value: 0.6 },
};
uniforms["topColor"].value.copy(new THREE.Color().setHSL(0.6, 1, 0.6));

scene.fog.color.copy(uniforms["bottomColor"].value);

const skyGeo = new THREE.SphereGeometry(4000, 32, 16);
const skyMat = new THREE.ShaderMaterial({
  uniforms: uniforms,
  vertexShader: `varying vec3 vWorldPosition; void main() { vec4 worldPosition = modelMatrix * vec4(
      position, 1.0 ); vWorldPosition = worldPosition.xyz; gl_Position = projectionMatrix
      * modelViewMatrix * vec4( position, 1.0 ); }`,
  fragmentShader: ` uniform vec3 topColor; uniform vec3 bottomColor; uniform float offset; uniform float
      exponent; varying vec3 vWorldPosition; void main() { float h = normalize(
      vWorldPosition + offset ).y; gl_FragColor = vec4( mix( bottomColor, topColor, max(
      pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 ); }`,
  side: THREE.BackSide,
});

const sky = new THREE.Mesh(skyGeo, skyMat);
scene.add(sky);

</script>

<style lang="scss" scoped>

</style>
