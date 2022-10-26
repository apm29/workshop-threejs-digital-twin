<template>
  <BasicCharts :option="option"></BasicCharts>
</template>

<script setup>
import BasicCharts from "./BasicCharts";
const props = defineProps({
  data: {
    type: Array,
    required: true,
    default: () => [],
  },
  dataAxisX: {
    type: Array,
    required: true,
    default: () => [],
  },
});

const { data, dataAxisX } = toRefs(props);

const option = computed(() => ({
  backgroundColor: "transparent",
  xAxis: {
    data: unref(dataAxisX),
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "shadow",
    },
  },
  yAxis: {},
  series: unref(data).map((it) => ({
    type: "bar",
    name: it.name,
    data: it.data,
  })),
}));
</script>

<style lang="scss" scoped></style>
