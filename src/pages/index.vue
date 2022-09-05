<template>
  <div
    flex="~ wrap"
    p="x-12 y-10"
    items="start"
    justify="around"
    gap="8"
    bg="dark-500"
  ></div>
</template>

<script setup></script>

<style lang="scss" scoped>
.router-link {
  @apply flex flex-col items-center text-white bg-sky-600 px-12 py-8 hover:shadow transition-all;
  i {
    @apply text-5xl;
  }
}
</style>
