<template>
  <div flex="~" justify="center" items="center" p="x-5 y-2" border="~ teal-300">
    <span text="blue-300">{{ title }}:</span>
    <span v-if="status" text="md" p="x-3" :class="DeviceStatusColorEnum[status.status]">{{
      DeviceStatusTextEnum[status.status]
    }}</span>
    <span v-else text="md" p="x-3"> 未知 </span>
  </div>
</template>

<script setup>
import { useDeviceStatusStore } from "~/store";
import { DeviceStatusTextEnum, DeviceStatusColorEnum } from "~/definition";

const props = defineProps({
  title: String,
  org: String,
  bucket: String,
  measurement: String,
});
const deviceStore = useDeviceStatusStore();
const status = computed(() => {
  return deviceStore.getSingleDeviceStatusBy({
    org: props.org,
    bucket: props.bucket,
    measurement: props.measurement,
  });
});
</script>

<style lang="scss" scoped>
.status-normal {
  @apply text-green-500;
}
.status-closed {
  @apply text-blue-500;
}
.status-error {
  @apply text-red-500;
}
.status-unknown {
  @apply text-orange-500;
}
</style>
