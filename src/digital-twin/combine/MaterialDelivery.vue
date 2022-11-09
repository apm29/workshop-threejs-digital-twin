<template>
  <SimpleBorder6 class="time-series-dialog-wrapper" bg="bluegray-900/80">
    <div
      class="time-series-dialog"
      text="sm gray-200"
      flex="~ col"
      p="x-6 y-4"
      w="160"
      min="h-100"
    >
      <h1 text="lg" font="bold" relative="~">
        {{ title }}
        <button @click="$emit('close')" text="2xl" absolute="~" right="2" top="1">
          <i i-mdi-close></i>
        </button>
      </h1>
      <div flex="~ grow" overflow="y-auto">
        <ModelGallery
          :model-path="model.path"
          :camera-position="model.cameraPosition"
        ></ModelGallery>
        <div flex="~ grow col" justify="around" gap="y-2" text="center">
          <div flex="grow" grid="~ cols-2 rows-2" gap="2">
            <div
              flex="~ col"
              justify="center"
              items="center"
              gap="x-2"
              p="x-5 y-2"
              border="~ bluegray-500"
            >
              <div text="blue-300"></div>
              <span text="blue-300">
                {{ materialDeliveryData?.OP === craftKey ? "投料中" : "投料百分比" }}
              </span>
              <div
                text="md green-500"
                flex="~ grow col"
                justify="end"
                w="50%"
                rounded="~"
                bg="orange-600/30"
                relative="~"
              >
                <div
                  bg="orange-600/70"
                  rounded="~"
                  :style="{
                    height: `${data?.bucketProgress ?? 0}%`,
                  }"
                ></div>
                <div
                  text="md green-500"
                  absolute="~"
                  bottom="0"
                  left="0"
                  right="0"
                  flex="~"
                  justify="center"
                  items="center"
                  :style="{
                    height: `${Math.max(data?.bucketProgress ?? 0, 30)}%`,
                  }"
                >
                  <div>{{ data?.bucketProgress }}%</div>
                </div>
              </div>
            </div>
            <div
              flex="~ col"
              justify="center"
              items="center"
              p="x-5 y-2"
              border="~ bluegray-500"
            >
              <span text="blue-300">桶数</span>
              <span text="4xl green-500" font="bold mono" p="x-3">
                {{ materialDeliveryData?.NP }}
              </span>
            </div>
            <div
              flex="~ col"
              justify="center"
              items="center"
              p="x-5 y-2"
              border="~ bluegray-500"
            >
              <span text="blue-300">产地</span>
              <span text="4xl green-500" font="bold" p="x-3"> {{ data?.place }} </span>
            </div>
            <div
              flex="~ col"
              justify="center"
              items="center"
              p="x-5 y-2"
              border="~ bluegray-500"
            >
              <span text="blue-300">原料</span>
              <span text="4xl green-500" font="bold" p="x-3">
                {{ data?.warehouse }}
              </span>
            </div>
          </div>
          <DeviceStatus
            title="设备状态"
            :org="status.org"
            :bucket="status.bucket"
            min="h-28"
            :measurement="status.measurement"
          ></DeviceStatus>
        </div>
      </div>
    </div>
  </SimpleBorder6>
</template>

<script setup>
import { useMaterialDeliveryStore } from "~/store/material-delivery";
import SimpleBorder6 from "~/svg/border/SimpleBorder6.vue";
import DeviceStatus from "./DeviceStatus.vue";
import ModelGallery from "./ModelGallery.vue";
const props = defineProps({
  title: String,
  craftKey: String,
  range: String,
  org: String,
  bucket: String,
  measurement: String,
  status: Object,
  model: Object,
});
const materialDeliveryStore = useMaterialDeliveryStore();
const { materialDeliveryData } = toRefs(materialDeliveryStore);
const data = computed(() => {
  return materialDeliveryData.value[props.craftKey];
});
</script>

<style lang="scss" scoped>
.time-series-dialog {
  background: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOsAAABKCAYAAABaSqOeAAADIklEQVR4nO3ZXW7rNhCG4W+Gln/qZgFdczfQdbYnjRObmmIoOidtryNggPcBCNmAAV0IL4aU7bc/4nf9X4/Qh6R1LgDfz3OZ6Sip/fduh399C91CepvXu6QHsQK78dFkaJHpbNIlr8+bf8YaoVeF/grpNUI3hd4z1ghiBfZgtsUappNpRHqV9GI2rjPWLc4M9c9Y9SNCb5Gxhu7BZAV2YTlZTYuZTjJd5OoW484tJ+yINbe+Y6Juof5YV/0dq25BrMBubDuvLuY6u6uP8nycXcekzVj7OKNu622G+rp23dZV9wh1Hhfw/czU3LW41EenGWqMUG8y9UO+9R0vk0LvufXNiZqh9m3d106swB68qbW29eZSC9PRskkbfX4c5tvex1gxJuk9J2qG+vjQe+9sg4E9tCbPP21ywpqPQO+fbUrrM9Y13/rm+TS2zz0naobaH0xWYC/e1aOpf2lxtdmo8xSAGogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSKIFSiCWIEiiBUogliBIogVKIJYgSIOM1g3k5vmMjVvaq0RM7CX7C27y/6+tOjPRp+xHsYyLWZa3LW0pq6j5F2dpwV8vzkgR3/ZYfb42WbGaqajQkuYTpbLdXZtgWbh0YgV2MPY0boWbzpnh9mjskmNeI9ZbJPpbNJZpou7+rqN22aue0grTwr4fnPbu4yB6frFTBez0eU5O81Y80cXSVe5eqbprhbbxCVWYCcZ6zyKnkaorl9Nus4+x15Ys9wXizFSm0InC71LekQQK7CH+TLpoC3W3O1eZXqZfc5Ytx9ex5ZYY498C9M9YzUmK7CXEWueUefR9PIMVV9jHX6eXbtCH9pCJVZgH8+/UY9zcP4k6R+4wfHJKSQgnwAAAABJRU5ErkJggg==")
    no-repeat;
  background-size: 100% 100%;
}
</style>
