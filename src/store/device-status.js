import { defineStore } from "pinia";
import { DeviceStatus } from "~/digital-twin/combine/data";
import { queryInfluxDb } from "~/api/influx";
import { DeviceStatusEnum } from "~/definition";

/**
 * 设备状态Store, 定期更新设备状态
 * 数据格式为 { org: "atcc", bucket: "3fc_cf_sbzt", measurement: "N_P1", title: "P1", key: "P1", status: 1 }
 * org/bucket/measurement为查询用, title展示用, key为获取模型对应的Object3D对象的唯一对应值,status为实际状态
 */
export const useDeviceStatusStore = defineStore("device-status", () => {
  const deviceStatus = ref([]);
  const lastUpdateTime = ref(0);
  const normalDeviceKeys = computed(() => {
    return deviceStatus.value
      .filter((d) => d.status === DeviceStatusEnum.NORMAL)
      .map((it) => it.key);
  });
  const closedDeviceKeys = computed(() => {
    return deviceStatus.value
      .filter((d) => d.status === DeviceStatusEnum.CLOSED)
      .map((it) => it.key);
  });
  const errorDeviceKeys = computed(() => {
    return deviceStatus.value
      .filter((d) => d.status === DeviceStatusEnum.ERROR)
      .map((it) => it.key);
  });
  const unknownDeviceKeys = computed(() => {
    return deviceStatus.value
      .filter((d) => d.status === DeviceStatusEnum.UNKNOWN)
      .map((it) => it.key);
  });
  onMounted(getDevicesStatus);
  //定时更新
  useIntervalFn(getDevicesStatus, 60_000);

  async function getDevicesStatus() {
    const res = await Promise.all(
      DeviceStatus.map(async (device) => {
        try {
          const res = await queryInfluxDb({
            org: device.org,
            bucket: device.bucket,
            measurement: device.measurement,
            range: -1, //只查一条
          });
          return {
            ...device,
            status: res?.data?.[0]?._value ?? DeviceStatusEnum.UNKNOWN,
          };
        } catch (err) {
          console.error(err);
          console.log(`查询设备状态${device.org}-${device.bucket}-${device.measurement}失败`);
          return {
            ...device,
            status: DeviceStatusEnum.ERROR,
          };
        }
      })
    );
    deviceStatus.value = res;
    lastUpdateTime.value = new Date().getTime();
  }

  function getSingleDeviceStatus(key) {
    return deviceStatus.value.find((it) => it.key === key);
  }

  function getSingleDeviceStatusBy({ org, bucket, measurement }) {
    return deviceStatus.value.find(
      (it) => it.org === org && it.bucket === bucket && it.measurement === measurement
    ) ?? {
      org, bucket, measurement,
      status: DeviceStatusEnum.UNKNOWN,
    };
  }

  return {
    //ref
    lastUpdateTime,
    deviceStatus,

    //computed
    normalDeviceKeys,
    closedDeviceKeys,
    errorDeviceKeys,
    unknownDeviceKeys,

    //function
    getSingleDeviceStatus,
    getSingleDeviceStatusBy,
  };
});
