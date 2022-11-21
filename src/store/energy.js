import { defineStore } from "pinia";
import { queryInfluxDb } from "~/api/influx";

/**
 * 大窑状态Store, 定期更新设备状态
 */
export const useEnergyStore = defineStore("energy-consumption", () => {
  const naturalGasTotal = ref(0);
  async function getNaturalGasTotal() {
    const res = await queryInfluxDb({
      org: "atcc",
      bucket: "3fc_nh",
      measurement: "TRQ_TRQ_GET_M3",
      range: -1,
    });
    naturalGasTotal.value = res.data?.[0]?._value ?? 0;
  }
  onMounted(getNaturalGasTotal);
  //定时更新
  useIntervalFn(getNaturalGasTotal, 60_000);

  const electricityGasTotal = ref(0);
  async function getElectricityTotal() {
    const res = await queryInfluxDb({
      org: "atcc",
      bucket: "3fc_nh",
      measurement: "CFXF_YDL_GET_KWH",
      range: -1,
    });
    electricityGasTotal.value = res.data?.[0]?._value ?? 0;
  }
  onMounted(getElectricityTotal);
  //定时更新
  useIntervalFn(getElectricityTotal, 60_000);
  return {
    //ref
    naturalGasTotal,
    electricityGasTotal,
    //computed

    //function
    getNaturalGasTotal,
    getElectricityTotal,
  };
});
