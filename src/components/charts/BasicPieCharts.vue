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
  title: String,
});

const { data, title } = toRefs(props);

const option = computed(() => ({
  backgroundColor: "transparent",
  title: {
    text: unref(title),
    textStyle: {
      fontSize: 16,
    },
    left: "center",
    top: "center",
  },
  series: [
    {
      type: "pie",
      label: {
        show: true,
        position: "inside",
        emphasis: {
          show: true,
        },
      },
      labelLine: {
        show: false,
      },
      emphasis: {
        label: {
          show: true,
          fontSize: "30",
          fontWeight: "bold",
        },
      },
      data: unref(data),
      radius: ["60%", "90%"],
    },
  ],
}));
</script>

<style lang="scss" scoped></style>
