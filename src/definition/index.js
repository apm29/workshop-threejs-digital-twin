export const DeviceStatusEnum = {
  NORMAL: 1,  //设备正常
  CLOSED: 2, //设备关闭
  ERROR: 3, //数据异常
  UNKNOWN: 10000, //未知
}

export const DeviceStatusTextEnum = {
  [DeviceStatusEnum.NORMAL]: "运行中",
  [DeviceStatusEnum.CLOSED]: "设备关闭",
  [DeviceStatusEnum.ERROR]: "数据异常",
  [DeviceStatusEnum.UNKNOWN]: "未知",
}


export const DeviceStatusColorEnum = {
  [DeviceStatusEnum.NORMAL]: "status-normal",
  [DeviceStatusEnum.CLOSED]: "status-closed",
  [DeviceStatusEnum.ERROR]: "status-error",
  [DeviceStatusEnum.UNKNOWN]: "status-unknown",
}
