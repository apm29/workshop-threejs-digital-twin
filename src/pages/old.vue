<template>
  <div bg="dark-500">
    <FactoryModel></FactoryModel>
  </div>
</template>

<script setup>
import FactoryModel from "~/digital-twin/FactoryModel.vue";
</script>

<style lang="scss" scoped>
.router-link {
  @apply flex flex-col items-center text-white bg-sky-600 px-12 py-8 hover:shadow transition-all;
  i {
    @apply text-5xl;
  }
}
</style>
