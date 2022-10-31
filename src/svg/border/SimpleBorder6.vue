<template>
  <div>
    <div class="dv-border-box-6" ref="wrapper">
      <svg
        class="dv-border-svg-container"
        :width="width"
        :height="height"
        :style="svgStyle"
      >
        <polyline class="line-width-2" :stroke="dark" :points="`0, 25 0, 0 25, 0`" />
        <polyline
          class="line-width-2"
          :stroke="dark"
          :points="`${width - 25}, 0 ${width}, 0 ${width}, 25`"
        />
        <polyline
          class="line-width-2"
          :stroke="dark"
          :points="`${width - 25}, ${height} ${width}, ${height} ${width}, ${
            height - 25
          }`"
        />
        <polyline
          class="line-width-2"
          :stroke="dark"
          :points="`0, ${height - 25} 0, ${height} 25, ${height}`"
        />

        <polyline class="line-width-5" :stroke="light" :points="`0, 10 0, 0 10, 0`" />
        <polyline
          class="line-width-5"
          :stroke="light"
          :points="`${width - 10}, 0 ${width}, 0 ${width}, 10`"
        />
        <polyline
          class="line-width-5"
          :stroke="light"
          :points="`${width - 10}, ${height} ${width}, ${height} ${width}, ${
            height - 10
          }`"
        />
        <polyline
          class="line-width-5"
          :stroke="light"
          :points="`0, ${height - 10} 0, ${height} 10, ${height}`"
        />
      </svg>
      <div class="border-box-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getRgbaValue } from "@jiaminghi/color";

const wrapper = ref();
const { width, height } = useElementSize(wrapper);
const color = ref("#235fa7");
const dark = computed(() => {
  const colorArray = getRgbaValue(color.value);
  colorArray[3] = 0.3;
  return `rgba(${colorArray.join(",")})`;
});
const light = computed(() => {
  const colorArray = getRgbaValue(color.value);
  colorArray[3] = 0.6;
  return `rgba(${colorArray.join(",")})`;
});
const svgStyle = computed(() => {
  return {
    "box-shadow": "inset 0 0 40px rgb",
    fill: "transparent",
  };
});
</script>

<style lang="scss" scoped>
.dv-border-box-6 {
  position: relative;
  width: 100%;
  height: 100%;
}
.dv-border-svg-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.border-box-content {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
