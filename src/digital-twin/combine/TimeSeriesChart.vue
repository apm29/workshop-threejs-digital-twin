<template>
  <SimpleBorder
    v-loading="loading"
    element-loading-text="加载数据中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)"
    class="time-series-dialog-wrapper"
    bg="bluegray-900/80"
  >
    <div
      class="time-series-dialog"
      text="sm gray-200"
      flex="~ col"
      p="x-6 y-4"
      w="160"
      h="100"
    >
      <h1 text="lg" font="bold" relative="~">
        {{ title }}
        <el-select :value="range" @input="$emit('update:range', $event)" size="mini">
          <el-option
            v-for="option of rangeOptions"
            :label="option.label"
            :value="option.value"
            :key="option.value"
          ></el-option>
        </el-select>
        <button @click="$emit('close')" text="2xl" absolute="~" right="2" top="1">
          <i i-mdi-close></i>
        </button>
      </h1>
      <div flex="grow" overflow="y-auto">
        <BasicLineCharts h="full" :data="data" :dataAxisX="dataAxisX" />
      </div>
    </div>
  </SimpleBorder>
</template>

<script setup>
import dayjs from "dayjs";
import { queryInfluxDb } from "~/api/influx";
import BasicLineCharts from "~/components/charts/BasicLineCharts.vue";
import SimpleBorder from "~/svg/border/SimpleBorder.vue";
const rangeOptions = [
  {
    label: "最近1分钟",
    value: "-1m",
  },
  {
    label: "最近5分钟",
    value: "-5m",
  },
  {
    label: "最近15分钟",
    value: "-15m",
  },
  {
    label: "最近1小时",
    value: "-1h",
  },
  {
    label: "最近3小时",
    value: "-3h",
  },
  {
    label: "最近6小时",
    value: "-6h",
  },
  {
    label: "最近12小时",
    value: "-12h",
  },
  {
    label: "最近24小时",
    value: "-24h",
  },
  {
    label: "最近2天",
    value: "-2d",
  },
  {
    label: "最近7天",
    value: "-7d",
  },
];
const props = defineProps({
  title: String,
  range: String,
  org: String,
  bucket: String,
  measurement: String,
});

const loading = ref(false);
const rawData = ref([]);
const data = computed(() => {
  return [
    {
      data: rawData.value.map((it) => it._value),
      name: "数据值",
    },
  ];
});
watch(() => props.range, queryModelData);
watch(() => props.org, queryModelData);
watch(() => props.bucket, queryModelData);
watch(() => props.measurement, queryModelData);
onMounted(queryModelData);
function queryModelData() {
  //查询数据
  rawData.value = [];
  loading.value = true;
  queryInfluxDb({
    org: props.org,
    bucket: props.bucket,
    measurement: props.measurement,
    range: props.range,
  })
    .then((res) => {
      rawData.value = res.data ?? [];
    })
    .finally(() => (loading.value = false));
}
const dataAxisX = computed(() => {
  return rawData.value.map((it) => dayjs(it._time).format("YYYY/MM/DD HH:mm:ss"));
});
</script>

<style lang="scss" scoped>
.time-series-dialog {
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOsAAABKCAYAAABaSqOeAAADIklEQVR4nO3ZXW7rNhCG4W+Gln/qZgFdczfQdbYnjRObmmIoOidtryNggPcBCNmAAV0IL4aU7bc/4nf9X4/Qh6R1LgDfz3OZ6Sip/fduh399C91CepvXu6QHsQK78dFkaJHpbNIlr8+bf8YaoVeF/grpNUI3hd4z1ghiBfZgtsUappNpRHqV9GI2rjPWLc4M9c9Y9SNCb5Gxhu7BZAV2YTlZTYuZTjJd5OoW484tJ+yINbe+Y6Juof5YV/0dq25BrMBubDuvLuY6u6uP8nycXcekzVj7OKNu622G+rp23dZV9wh1Hhfw/czU3LW41EenGWqMUG8y9UO+9R0vk0LvufXNiZqh9m3d106swB68qbW29eZSC9PRskkbfX4c5tvex1gxJuk9J2qG+vjQe+9sg4E9tCbPP21ywpqPQO+fbUrrM9Y13/rm+TS2zz0naobaH0xWYC/e1aOpf2lxtdmo8xSAGogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSIOM1g3k5vmMjVvaq0RM7CX7C27y/6+tOjPRp+xHsYyLWZa3LW0pq6j5F2dpwV8vzkgR3/ZYfb42WbGaqajQkuYTpbLdXZtgWbh0YgV2MPY0boWbzpnh9mjskmNeI9ZbJPpbNJZpou7+rqN22aue0grTwr4fnPbu4yB6frFTBez0eU5O81Y80cXSVe5eqbprhbbxCVWYCcZ6zyKnkaorl9Nus4+x15Ys9wXizFSm0InC71LekQQK7CH+TLpoC3W3O1eZXqZfc5Ytx9ex5ZYY498C9M9YzUmK7CXEWueUefR9PIMVV9jHX6eXbtCH9pCJVZgH8+/UY9zcP4k6R+4wfHJKSQgnwAAAABJRU5ErkJggg==")
    no-repeat;
  background-size: 100% 100%;
}
</style>
