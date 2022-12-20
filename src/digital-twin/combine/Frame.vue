<template>
  <!-- <SimpleBorder fixed="~" top="0" left="0" w="100" h="100"></SimpleBorder> -->
 <div>
  <SimpleHeader fixed="~" top="0" left="0" p="b-12" w="auto" h="18">
    安特磁材三分厂数字化
  </SimpleHeader>
  <div fixed="~" top="20" left="2" flex="~" gap="3">
      <SimpleBorder6
        z="30"
        bg="gradient-to-b"
        via="dark-700/70"
        from="dark-500/70"
        to="dark-500/70"
      >
        <div p="x-3 y-2">
          <SimpleNumber
            text="4xl white"
            prefix="天然气用量"
            suffix="m³"
            :value="naturalGasTotal"
          ></SimpleNumber>
        </div>
      </SimpleBorder6>
      <SimpleBorder6
        z="30"
        bg="gradient-to-b"
        via="dark-700/70"
        from="dark-500/70"
        to="dark-500/70"
      >
        <div p="x-3 y-2">
          <SimpleNumber
            text="4xl white"
            prefix="电力消耗"
            :value="electricityGasTotal"
            suffix="kWh"
          ></SimpleNumber>
        </div>
      </SimpleBorder6>
      <SimpleBorder6
        z="30"
        bg="gradient-to-b"
        via="dark-700/70"
        from="dark-500/70"
        to="dark-500/70"
      >
        <div p="x-3 y-2">
          <SimpleNumber
            text="4xl white"
            prefix="当前生产型号"
            :value="sensitive(currentProducingFormula?.productNo) ?? '- -'"
          ></SimpleNumber>
        </div>
      </SimpleBorder6>
      <SimpleBorder6
        z="30"
        bg="gradient-to-b"
        via="dark-700/70"
        from="dark-500/70"
        to="dark-500/70"
      >
        <div flex="~" p="x-3 y-2">
          <h1 text="blue-400 xl" m="r-2">进料</h1>
          <div flex="~" gap="6">
            <div>
              <h1 text="white xl">P1</h1>
              <SimpleNumber
                text="4xl white"
                suffix="kg"
                :value="deliveryAmount.P1"
              ></SimpleNumber>
            </div>
            <div>
              <h1 text="white xl">P2</h1>
              <SimpleNumber
                text="4xl white"
                suffix="kg"
                :value="deliveryAmount.P2"
              ></SimpleNumber>
            </div>
            <div>
              <h1 text="white xl">P3</h1>
              <SimpleNumber
                text="4xl white"
                suffix="kg"
                :value="deliveryAmount.P3"
              ></SimpleNumber>
            </div>
            <div>
              <h1 text="white xl">P4</h1>
              <SimpleNumber
                text="4xl white"
                suffix="kg"
                :value="deliveryAmount.P4"
              ></SimpleNumber>
            </div>
            <div>
              <h1 text="white xl">P5</h1>
              <SimpleNumber
                text="4xl white"
                suffix="kg"
                :value="deliveryAmount.P5"
              ></SimpleNumber>
            </div>
            <div>
              <h1 text="white lg">配料桶数</h1>
              <SimpleNumber
                text="4xl white"
                suffix="桶"
                :value="materialDeliveryData.NP"
              ></SimpleNumber>
            </div>
          </div>
        </div>
      </SimpleBorder6>

      <SimpleBorder6
        z="30"
        bg="gradient-to-b"
        via="dark-700/70"
        from="dark-500/70"
        to="dark-500/70"
      >
        <div flex="~" p="x-3 y-2" gap="3">
          <h1 text="blue-400 xl" m="r-2">出料</h1>
          <div flex="~" gap="6">
            <div>
              <h1 text="white lg">日出料</h1>
              <SimpleNumber
                text="4xl white"
                suffix="kg"
                :value="coarsePowderOutput.day"
              ></SimpleNumber>
            </div>
          </div>
          <div flex="~" gap="6">
            <div>
              <h1 text="white lg">月出料</h1>
              <SimpleNumber
                text="4xl white"
                suffix="kg"
                :value="coarsePowderOutput.month"
              ></SimpleNumber>
            </div>
          </div>
        </div>
      </SimpleBorder6>
    </div>
    <div v-if="false" fixed="~" bottom="2" left="2" right="2" flex="~" gap="3">
      <SimpleBorder6
        z="30"
        w="full"
        bg="gradient-to-b"
        via="dark-300/70"
        from="dark-500/70"
        to="dark-500/70"
      >
        <iframe
          id="iframe"
          src="http://atcc-workshop.autopaddle.com/charts/#/factory-3/material/daily"
          frameborder="0"
          width="100%"
          height="100%"
        />
      </SimpleBorder6>
    </div>
 </div>
</template>

<script setup>
import SimpleBorder from "~/svg/border/SimpleBorder.vue";
import SimpleHeader from "~/svg/header/SimpleHeader.vue";
import SimpleBorder6 from "~/svg/border/SimpleBorder6.vue";
import SimpleNumber from "~/svg/SimpleNumber.vue";
import { sensitive } from "~/composables";
import AttachDialog from "~/digital-twin/components/AttachDialog.vue";
import {
  useEnergyStore,
  useMaterialDeliveryStore,
} from "~/store";
//能耗
const energyStore = useEnergyStore();
const { naturalGasTotal, electricityGasTotal } = toRefs(energyStore); //能耗

//投料数据
const materialDeliveryStore = useMaterialDeliveryStore();
const {
  materialDeliveryData,
  deliveryAmount,
  coarsePowderOutput,
  currentProducingFormula,
} = toRefs(materialDeliveryStore);
</script>

<style lang="scss" scoped></style>
