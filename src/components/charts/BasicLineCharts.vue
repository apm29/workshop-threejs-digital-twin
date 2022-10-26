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
  title: String,
});

const { data, title, dataAxisX } = toRefs(props);

const option = computed(() => ({
  backgroundColor: "transparent",
  title: {
    text: unref(title),
    textStyle: {
      fontSize: 16,
    },
    left: "center",
    top: "0",
  },
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
    },
  },
  grid: {
    left: 50,
    right: 20,
    top: 30,
    bottom: 50,
  },
  xAxis: {
    type: "category",
    data: unref(dataAxisX),
  },
  yAxis: {
    type: "value",
  },
  series: unref(data).map((d) => ({
    type: "line",
    data: d.data,
    name: d.name,
    smooth: true,
  })),
}));
</script>

<style lang="scss" scoped></style>
