<template>
  <div
    class="absolute top-0 right-0 w-full h-full overflow-hidden z-10 flex flex justify-end"
    :class="[value ? 'pointer-events-auto' : 'pointer-events-none', wrapperClass]"
  >
    <transition name="fade">
      <div
        v-if="value"
        class="bg-gray-600 bg-opacity-30 flex-grow absolute top-0 right-0 w-full h-full"
        @click="persistent ? null : $emit('input', false)"
      ></div>
    </transition>
    <transition name="slide-fade">
      <div
        class="flex flex-col shadow bg-white min-h-96 max-h-100vh overflow-y-scroll p-3 z-30"
        :class="contentClass"
        v-if="value"
      >
        <slot name="title">
          <div class="flex px-3 flex-shrink-0">
            <div class="flex-grow font-bold text-gray-700 text-base pb-2">
              {{ title }}
            </div>
            <button
              class="focus:outline-none"
              v-if="closeable"
              @click="$emit('input', false)"
            >
              <i class="i-mdi-close text-gray-500 text-xl" />
            </button>
          </div>
        </slot>
        <slot />
      </div>
    </transition>
  </div>
</template>

<script setup>
defineProps({
  value: Boolean,
  closeable: Boolean,
  persistent: Boolean,
  title: String,
  contentClass: String,
  wrapperClass: String,
});
</script>

<style scoped>
/* 可以设置不同的进入和离开动画 */
/* 设置持续时间和动画函数 */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from, .slide-fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(100%);
  opacity: 0;
}

.slide-fade-enter-to, .slide-fade-leave-from
  /* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(0%);
  opacity: 1;
}

.fade-enter-active {
  transition: all 0.3s ease;
}
.fade-leave-active {
  transition: all 0.3s ease;
}
.fade-enter, .fade-leave-to
  /* .slide-fade-leave-active for below version 2.1.8 */ {
  opacity: 0;
}
</style>
