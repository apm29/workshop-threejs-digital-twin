<template>
  <div fixed="~" :style="style">
    <div relative="~" :style="wrapperStyle" ref="wrapper">
      <slot name="trigger" :toggle="toggle" :show="internalValue">
        <button
          class="drawer-button"
          @click="toggle"
          text="center sky-500 shadow-lg 4xl"
          absolute="~"
          :style="buttonStyle"
        >
          <template v-if="direction === 'bottom'">
            <i animate="~ pulse" v-if="!internalValue" i="mdi-chevron-double-up"></i>
            <i animate="~ pulse" v-else i="mdi-chevron-double-down"></i>
          </template>
          <template v-if="direction === 'right'">
            <i animate="~ pulse" v-if="!internalValue" i="mdi-chevron-double-left"></i>
            <i animate="~ pulse" v-else i="mdi-chevron-double-right"></i>
          </template>
          <template v-if="direction === 'left'">
            <i animate="~ pulse" v-if="!internalValue" i="mdi-chevron-double-right"></i>
            <i animate="~ pulse" v-else i="mdi-chevron-double-left"></i>
          </template>
        </button>
      </slot>
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import TWEEN from "@tweenjs/tween.js";
const props = defineProps({
  value: {
    type: Boolean,
  },
  direction: {
    type: String,
    validator: function (direction) {
      return ["left", "top", "right", "bottom"].includes(direction);
    },
    default: function () {
      return "bottom";
    },
  },
  duration: {
    type: Number,
    default: 200,
  },
});

const wrapper = ref();

const internalValue = ref(props.value);
const isVerticalInitial = computed(() => ["top", "bottom"].includes(props.direction));

const open = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
};
const close = {
  bottom: 100,
  left: -100,
  right: 100,
  top: 0,
};

const tweenProperty = reactive({
  percent: props.value ? open[props.direction] : close[props.direction],
});
const style = computed(() => {
  return {
    transform: `${isVerticalInitial.value ? "translateY" : "translateX"}(${
      tweenProperty.percent
    }%)`,
    bottom: props.direction === "bottom" ? 0 : undefined,
    left: props.direction === "left" ? 0 : undefined,
    right: props.direction === "right" ? 0 : undefined,
    top: props.direction === "top" ? 0 : undefined,
  };
});

const buttonStyle = computed(() => {
  return {
    top: props.direction === "bottom" ? "-3rem" : undefined,
    right: props.direction === "left" ? "-3rem" : undefined,
    left: props.direction === "right" ? "-3rem" : undefined,
    bottom: props.direction === "top" ? "-3rem" : undefined,
    width: isVerticalInitial.value ? "100%" : undefined,
    height: isVerticalInitial.value ? undefined : "100%",
  };
});
const wrapperStyle = computed(() => {
  return {
    width: isVerticalInitial.value ? "100%" : undefined,
    height: isVerticalInitial.value ? undefined : "100%",
  };
});
function toggle() {
  internalValue.value = !internalValue.value;
  const tween = new TWEEN.Tween(tweenProperty);

  tween.to(
    {
      percent: internalValue.value ? open[props.direction] : close[props.direction],
    },
    props.duration
  );
  tween.start();
}
</script>

<style lang="scss" scoped></style>
