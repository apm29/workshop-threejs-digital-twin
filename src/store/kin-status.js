import { defineStore } from "pinia";
import { queryInfluxDb } from "~/api/influx";

/**
 * 大窑状态Store, 定期更新设备状态
 * 数据格式为 { org: "atcc", bucket: "3fc_cf_sbzt", measurement: "N_P1", title: "P1", key: "P1", status: 1 }
 * org/bucket/measurement为查询用, title展示用, key为获取模型对应的Object3D对象的唯一对应值,status为实际状态
 */
export const useKinStatusStore = defineStore("kin-status", () => {
  const animationScale = ref(1 / 60);
  async function getRotateSpeed() {
    const res = await queryInfluxDb({
      org: "atcc",
      bucket: "ControlRoom",
      measurement: "H_HZY",
      range: -1
    })
    const hz = res.data?.[0]?._value ?? 0;
    //转速=Hz除以转速比
    const rpm = hz / 40;
    //转动动画-120帧转动2圈-> 约1秒1圈
    const animationRpm = 60;
    animationScale.value = rpm / animationRpm;
  }
  onMounted(getRotateSpeed)
  return {
    //ref
    animationScale
    //computed

    //function
  };
});
