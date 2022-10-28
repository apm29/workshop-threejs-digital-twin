<template>
  <div>
    <div class="dv-border-box-12" ref="wrapper">
      <svg class="dv-border-svg-container" :width="width" :height="height">
        <defs>
          <filter :id="filterId" height="150%" width="150%" x="-25%" y="-25%">
            <feMorphology
              operator="dilate"
              radius="1"
              in="SourceAlpha"
              result="thicken"
            />
            <feGaussianBlur in="thicken" stdDeviation="2" result="blurred" />
            <feFlood :flood-color="fade(colors[1], 70)" result="glowColor">
              <animate
                attributeName="flood-color"
                :values="`
                ${fade(colors[1], 70)};
                ${fade(colors[1], 30)};
                ${fade(colors[1], 70)};
              `"
                dur="3s"
                begin="0s"
                repeatCount="indefinite"
              />
            </feFlood>
            <feComposite
              in="glowColor"
              in2="blurred"
              operator="in"
              result="softGlowColored"
            />
            <feMerge>
              <feMergeNode in="softGlowColored" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <path
          v-if="width && height"
          :fill="backgroundColor"
          stroke-width="2"
          :stroke="colors[0]"
          :d="`
          M15 5 L ${width - 15} 5 Q ${width - 5} 5, ${width - 5} 15
          L ${width - 5} ${height - 15} Q ${width - 5} ${height - 5}, ${width - 15} ${
            height - 5
          }
          L 15, ${height - 5} Q 5 ${height - 5} 5 ${height - 15} L 5 15
          Q 5 5 15 5
        `"
        />

        <path
          stroke-width="2"
          fill="transparent"
          stroke-linecap="round"
          :filter="`url(#${filterId})`"
          :stroke="colors[1]"
          :d="`M 20 5 L 15 5 Q 5 5 5 15 L 5 20`"
        />

        <path
          stroke-width="2"
          fill="transparent"
          stroke-linecap="round"
          :filter="`url(#${filterId})`"
          :stroke="colors[1]"
          :d="`M ${width - 20} 5 L ${width - 15} 5 Q ${width - 5} 5 ${width - 5} 15 L ${
            width - 5
          } 20`"
        />

        <path
          stroke-width="2"
          fill="transparent"
          stroke-linecap="round"
          :filter="`url(#${filterId})`"
          :stroke="colors[1]"
          :d="`
          M ${width - 20} ${height - 5} L ${width - 15} ${height - 5}
          Q ${width - 5} ${height - 5} ${width - 5} ${height - 15}
          L ${width - 5} ${height - 20}
        `"
        />

        <path
          stroke-width="2"
          fill="transparent"
          stroke-linecap="round"
          :filter="`url(#${filterId})`"
          :stroke="colors[1]"
          :d="`
          M 20 ${height - 5} L 15 ${height - 5}
          Q 5 ${height - 5} 5 ${height - 15}
          L 5 ${height - 20}
        `"
        />
      </svg>

      <div class="border-box-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { fade } from "@jiaminghi/color";

const wrapper = ref();
const { width, height } = useElementSize(wrapper);
const backgroundColor = ref("transparent");
const colors = ref(["#4fd2dd", "#235fa7"]);
const border = ref(["left-top", "right-top", "left-bottom", "right-bottom"]);
const filterId = `borderr-box-12-filterId-${uuid()}`;
function uuid(hasHyphen) {
  return (hasHyphen
    ? "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
    : "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx"
  ).replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
</script>

<style lang="scss" scoped>
.dv-border-box-12 {
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
