import { defineStore } from "pinia";
import { queryCurrentUsedFormula } from "~/api/formula";
import { queryInfluxDb } from "~/api/influx";

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
  //测试数据
  const test = [
    {
      "id": 132,
      "formulaId": 73,
      "warehouse": "铁红",
      "warehouseId": "5",
      "place": "柳钢",
      "placeId": "71",
      "batchNo": "",
      "bucketNum": "1",
      "formula": "219",
      "deviation": "0.2"
    },
    {
      "id": 133,
      "formulaId": 73,
      "warehouse": "铁红",
      "warehouseId": "5",
      "place": "柳钢",
      "placeId": "71",
      "batchNo": "",
      "bucketNum": "2",
      "formula": "219",
      "deviation": "0.2"
    },
    {
      "id": 134,
      "formulaId": 73,
      "warehouse": "碳酸锶",
      "warehouseId": "3",
      "place": "墨西哥",
      "placeId": "57",
      "batchNo": "",
      "bucketNum": "3",
      "formula": "74",
      "deviation": "0.2"
    },
    {
      "id": 135,
      "formulaId": 73,
      "warehouse": "无水氯化锶",
      "warehouseId": "6",
      "place": "元和",
      "placeId": "76",
      "batchNo": "",
      "bucketNum": "4",
      "formula": "8",
      "deviation": "0.2"
    },
    {
      "id": 136,
      "formulaId": 73,
      "warehouse": "氧化铋",
      "warehouseId": "7",
      "place": "铋融汇",
      "placeId": "81",
      "batchNo": "",
      "bucketNum": "5",
      "formula": "2.5",
      "deviation": "0.2"
    }
  ]
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
    // const res = await queryCurrentUsedFormula()
    //测试
    const formulaData = test
    const progressData = await Promise.all(Object.keys(querys).map((key) => {
      const { org, bucket, measurement } = querys[key]
      return queryInfluxDb({
        org, bucket, measurement, range: "-15m"
      }).then(res => Math.floor(res.data.reverse()[0]?._value ?? 0))
    }))

    lastUpdateTime.value = new Date().getTime();
    const result = {}

    //P1 - P5 产地/原料
    result.P1 = formulaData.find(it => it.bucketNum === '1')
    result.P2 = formulaData.find(it => it.bucketNum === '2')
    result.P3 = formulaData.find(it => it.bucketNum === '3')
    result.P4 = formulaData.find(it => it.bucketNum === '4')
    result.P5 = formulaData.find(it => it.bucketNum === '5')

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

    materialDeliveryData.value = result;



  }

  return {
    //ref
    lastUpdateTime,
    materialDeliveryData,

    //computed

    //function
  };
});
