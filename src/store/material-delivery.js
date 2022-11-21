import { defineStore } from "pinia";
import { queryCurrentUsedFormula } from "~/api/formula";
import { queryInfluxDb } from "~/api/influx";
import { getCoarsePowderLineOutput } from "~/api/coarse-powder";

/**
 * 设备状态Store, 定期更新进料数据
 * 进料NP,P1_ADD ~ P5_ADD
 * 配方数据-P1 ~ P5
 */
export const useMaterialDeliveryStore = defineStore("material-delivery", () => {
  const materialDeliveryData = ref({});
  const lastUpdateTime = ref(0);

  onMounted(getData);
  //定时更新
  useIntervalFn(getData, 30_000);

  const querys = {
    //桶数
    NP: {
      org: "atcc",
      bucket: "JLKZQ",
      measurement: "N_PLTS",
    },
    //百分比 最大100
    P1: {
      org: "atcc",
      bucket: "JLKZQ",
      measurement: "N_P1_ADD",
    },
    P2: {
      org: "atcc",
      bucket: "JLKZQ",
      measurement: "N_P2_ADD",
    },
    P3: {
      org: "atcc",
      bucket: "JLKZQ",
      measurement: "N_P3_ADD",
    },
    P4: {
      org: "atcc",
      bucket: "JLKZQ",
      measurement: "N_P4_ADD",
    },
    P5: {
      org: "atcc",
      bucket: "JLKZQ",
      measurement: "N_P5_ADD",
    },
    //当前进料桶
    OP: {
      org: "atcc",
      bucket: "JLKZQ",
      measurement: "N_P",
    },
  }

  async function getData() {
    let res
    try {
      res = await queryCurrentUsedFormula()
    } catch (error) {
      console.log(error);
    }
    //测试
    const formulaData = res?.data ?? []

    console.log(formulaData);

    const result = {}

    //P1 - P5 产地/原料
    result.P1 = formulaData.find(it => it.bucketNum === '1') || {}
    result.P2 = formulaData.find(it => it.bucketNum === '2') || {}
    result.P3 = formulaData.find(it => it.bucketNum === '3') || {}
    result.P4 = formulaData.find(it => it.bucketNum === '4') || {}
    result.P5 = formulaData.find(it => it.bucketNum === '5') || {}
    let progressData = []
    try {
      progressData = await Promise.all(Object.keys(querys).map((key) => {
        const { org, bucket, measurement } = querys[key]
        return queryInfluxDb({
          org, bucket, measurement, range: "-15m"
        }).then(res => Math.floor(res.data.reverse()?.[0]?._value ?? 0))
      }))
    } catch (error) {
      console.log(error);
    }
    //总桶数
    result.NP = progressData[0]
    //进度
    result.P1.bucketProgress = progressData[1]
    result.P2.bucketProgress = progressData[2]
    result.P3.bucketProgress = progressData[3]
    result.P4.bucketProgress = progressData[4]
    result.P5.bucketProgress = progressData[5]
    //当前投料桶号
    result.OP = `P${parseInt(progressData[6])}`

    console.log(progressData);

    lastUpdateTime.value = new Date().getTime();
    materialDeliveryData.value = result;




  }

  //进料数据
  const querysDelivery = {
    P1: {
      org: "atcc",
      bucket: "JLKZQ",
      measurement: "N_P1",
    },
    P2: {
      org: "atcc",
      bucket: "JLKZQ",
      measurement: "N_P2",
    },
    P3: {
      org: "atcc",
      bucket: "JLKZQ",
      measurement: "N_P3",
    },
    P4: {
      org: "atcc",
      bucket: "JLKZQ",
      measurement: "N_P4",
    },
    P5: {
      org: "atcc",
      bucket: "JLKZQ",
      measurement: "N_P5",
    },
  }
  const deliveryAmount = reactive({})
  async function getDeliveryAmount() {
    let progressData = []
    try {
      progressData = await Promise.all(Object.keys(querysDelivery).map((key) => {
        const { org, bucket, measurement } = querysDelivery[key]
        return queryInfluxDb({
          org, bucket, measurement, range: "-20m"
        }).then(res => Math.floor(res.data.reverse()?.[0]?._value ?? 0))
      }))
    } catch (error) {
      console.log(error);
    }
    console.log(progressData);
    deliveryAmount.P1 = progressData[0];
    deliveryAmount.P2 = progressData[1];
    deliveryAmount.P3 = progressData[2];
    deliveryAmount.P4 = progressData[3];
    deliveryAmount.P5 = progressData[4];
  }
  onMounted(getDeliveryAmount);
  //定时更新
  useIntervalFn(getDeliveryAmount, 60_000);


  //出料数据
  const coarsePowderOutput = ref({})
  async function getCoarsePowderLineOutputData() {
    const res = await getCoarsePowderLineOutput()
    coarsePowderOutput.value = res.data
  }
  onMounted(getCoarsePowderLineOutputData);
  //定时更新
  useIntervalFn(getCoarsePowderLineOutputData, 60_000);

  return {
    //ref
    lastUpdateTime,
    materialDeliveryData,
    deliveryAmount,
    coarsePowderOutput
    //computed

    //function
  };
});
