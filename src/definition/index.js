export const DeviceStatusEnum = {
  NORMAL: 1,  //设备正常
  CLOSED: 2, //设备关闭
  ERROR: 3, //数据异常
  CRAFT_ERROR: 4, //工艺状态异常,过高或过低
  UNKNOWN: 10000, //未知
}

export const DeviceStatusTextEnum = {
  [DeviceStatusEnum.NORMAL]: "运行中",
  [DeviceStatusEnum.CLOSED]: "设备关闭",
  [DeviceStatusEnum.ERROR]: "数据异常",
  [DeviceStatusEnum.CRAFT_ERROR]: "工艺状态异常",
  [DeviceStatusEnum.UNKNOWN]: "未知",
}


export const DeviceStatusColorEnum = {
  [DeviceStatusEnum.NORMAL]: "status-normal",
  [DeviceStatusEnum.CLOSED]: "status-closed",
  [DeviceStatusEnum.ERROR]: "status-error",
  [DeviceStatusEnum.CRAFT_ERROR]: "status-craft-error",
  [DeviceStatusEnum.UNKNOWN]: "status-unknown",
}

export const CraftStatusEnum = {
  NORMAL: 1,  //正常
  HIGH: 2, //过高
  LOW: 3, //过低
  ERROR: 4, //异常
}
